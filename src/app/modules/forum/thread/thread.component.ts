import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    IThread, IThreadPost, IThreadUser
} from '../model';
import {
    ForumService
} from '../forum.service';
import {
    ActivatedRoute, Router
} from '@angular/router';
import {
    Store
} from '@ngrx/store';
import {
    AppState
} from '../../../theme/interfaces';
import {
    selectAuthUser
} from '../../../theme/reducers/auth.selectors';
import {
    IUser
} from '../../../theme/models/user';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { IErrorResult, IPageQueries } from '../../../theme/models/page';
import { ForumEditorComponent } from '../forum-editor/forum-editor.component';
import { DownloadService, SearchService, ThemeService } from '../../../theme/services';
import { openLink } from '../../../theme/deeplink';
import { eachObject, mapFormat } from '../../../theme/utils';
import { emailValidate } from '../../../theme/validators';
import { DialogBoxComponent } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';

@Component({
    selector: 'app-thread',
    templateUrl: './thread.component.html',
    styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {

    @ViewChild(ForumEditorComponent)
    public editor: ForumEditorComponent;

    public thread: IThread;
    public items = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        user: 0,
        order: '',
        status: 0,
    };

    public user: IUser;
    public form = this.fb.group({
        content: ['', Validators.required], 
    });

    public editData: any = {};
    public rewardData = {
        amount: 10,
    };
    public statusData = {
        items: [$localize `None`, $localize `Reviewed`, $localize `Done`,  $localize `Positive`, $localize `Opposition`],
        selected: 0,
    };

    constructor(
        private fb: FormBuilder,
        private toastrService: DialogService,
        private store: Store<AppState>,
        private service: ForumService,
        private route: ActivatedRoute,
        private router: Router,
        private downloadService: DownloadService,
        private searchService: SearchService,
        private themeService: ThemeService
    ) {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
        });
        this.route.params.subscribe(params => {
            this.service.getThread(params.id).subscribe(res => {
                this.themeService.setTitle(res.title);
                if (res.classify && res.classify instanceof Array) {
                    res.classify = undefined;
                }
                this.thread = res;
                this.tapRefresh();
            });
        });
    }

    public loadUser(item: IThreadPost) {
        item.is_hover_user = true;
        if (item.is_loaded) {
            return;
        }
        this.markUser(item.user_id, true);
        this.service.threadUser(item.user_id).subscribe({
            next: res => {
                this.markUser(item.user_id, true, res);
            },
            error: _ => {
                this.markUser(item.user_id, false);
            }
        });
    }

    /**
     * 标记用户信息是否加载
     * @param userId 
     * @param loaded 
     * @param info 
     */
    private markUser(userId: number, loaded: boolean, info?: IThreadUser) {
        for (const it of this.items) {
            if (it.user_id == userId) {
                it.is_loaded = loaded;
                if (info) {
                    it.user = info;
                }
            }
        }
    }

    public tapSeeUser(user: number = 0) {
        this.queries.user = user;
        this.tapRefresh();
    }

    public tapSortOrder() {
        this.queries.order = this.queries.order == 'desc' ? 'asc' : 'desc';
        this.tapRefresh();
    }

    public onStatusChange() {
        this.tapRefresh();
    }

    public open(modal: DialogBoxComponent) {
        if (!this.thread || !this.user || !modal) {
            return;
        }
        this.editData = {
            remark: '',
        };
        const maps = {
            highlightable: 'is_highlight',
            digestable: 'is_digest',
            closeable: 'is_closed',
            topable: 'top_type',
        };
        eachObject(maps, (k, i) => {
            if (this.thread[i]) {
                this.editData[k] = this.thread[k];
            }
        });
        modal.open(() => {
            this.service.threadAction(this.thread.id, this.editData).subscribe(res => {
                eachObject(maps, i => {
                    this.thread[i] = res[i];
                });
            });
        }, () => !emailValidate(this.editData.remark));
    }

    public tapBlock(block: any, item: IThreadPost) {
        if (block.confirm && !confirm(block.confirm)) {
            return;
        }
        if (block.type === 4) {
            openLink(this.router, block.link);
            return;
        }
        if (block.tag === 'vote') {
            const items: number[] = block.items.filter(i => i.checked).map(i => {
                return i.i;
            });
            if (items.length < 1) {
                this.toastrService.warning($localize `Please select a voting item`);
                return;
            }
            this.service.postDo({
                id: item.id,
                index: block.uid,
                data: block.max > 1 ? items : items[0]
            }).subscribe({
                next: res => {
                    item.content = res.data.content;
                    this.toastrService.success($localize `Successful Voting`);
                }, 
                error: (err: IErrorResult) => {
                    this.toastrService.warning(err.error.message);
                }
            });
            return;
        }
        if (block.tag === 'hide_buy' || block.tag === 'file_buy') {
            this.service.postDo({
                id: item.id,
                index: block.uid,
            }).subscribe({
                next: res => {
                    if (res.data) {
                        item.content = res.data.content;
                    }
                    this.toastrService.success($localize `Successful payment`);
                }, 
                error: (err: IErrorResult) => {
                    this.toastrService.warning(err.error.message);
                }
            });
            return;
        }
        if (block.tag === 'hide' || block.tag === 'file_login') {
            if (!this.user) {
                this.router.navigate(['/auth'], {
                    queryParams: {
                        redirect_uri: window.location.href
                    }
                });
                return;
            }
            const element = document.querySelector('#post-editor');
            if (element) {
                element.scrollIntoView();
            }
            return;
        }
        if (block.tag == 'file') {
            this.downloadService.export('forum/thread/do', {
                id: item.id,
                index: block.uid,
            });
            return;
        }
    }

    public formatStatus(item: IThreadPost) {
        return mapFormat(item.status || 0, this.statusData.items);
    }

    public tapChange(modal: DialogEvent, item: IThreadPost) {
        if (!this.thread.editable) {
            return;
        }
        this.statusData.selected = item.status || 0;
        modal.open(() => {
            this.service.postChange({
                id: item.id,
                status: this.statusData.selected
            }).subscribe(res => {
                item.status = res.status;
            });
        });
    }

    public tapReply(item: IThreadPost) {
        if (!this.editor) {
            return;
        }
        const element = document.querySelector('#post-editor');
        if (element) {
            element.scrollIntoView();
        }
        this.editor.insertAt(item.id, item.user.name);
    }

    public toggleLike() {
        this.service.threadAction(this.thread.id, [
            'like'
        ]).subscribe({
            next: res => {
                this.thread.like_type = res.like_type;
            },
            error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public toggleCollect() {
        this.service.threadAction(this.thread.id, [
            'collect'
        ]).subscribe({
            next: res => {
                this.thread.is_collected = res.is_collected;
            },
            error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapReward(modal: DialogEvent) {
        modal.open(() => {
            this.service.threadAction(this.thread.id, {
                reward: this.rewardData.amount
            }).subscribe({
                next: res => {
                    this.thread.is_reward = res.is_reward;
                },
                error: err => {
                    this.toastrService.warning(err.error.message);
                }
            });
        }, () => this.rewardData.amount > 0);
        
    }


    public toggeTop() {
        this.service.threadAction(this.thread.id, ['top_type']).subscribe({
            next: res => {
                this.thread.top_type = res.top_type;
            }, 
            error: (err: IErrorResult) => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapRemove(item: IThreadPost) {
        this.toastrService.confirm($localize `Sure to delete reposts?`, () => {
            this.service.postRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Deleted successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `The content is not filled out completely`);
            return;
        }
        const data = {...this.form.value, thread_id: this.thread.id};
        e?.enter();
        this.service.postCreate(data).subscribe({
            next: res => {
                e?.reset();
                this.toastrService.success($localize `Reply successfully`);
                this.form.patchValue({
                    content: '',
                });
                if (this.queries.page < 2) {
                    this.tapRefresh();
                }
            }, 
            error: (err: IErrorResult) => {
                e?.reset();
                if (err.error.code === 401) {
                    this.searchService.emitLogin();
                    return;
                }
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.getPostList({...queries, thread: this.thread.id}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
