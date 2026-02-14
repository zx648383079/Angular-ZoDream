import { Component, inject, signal, viewChild } from '@angular/core';
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
import { DialogEvent, DialogService } from '../../../components/dialog';
import { IErrorResult } from '../../../theme/models/page';
import { ForumEditorComponent } from '../components/forum-editor/forum-editor.component';
import { FileUploadService, SearchService, ThemeService } from '../../../theme/services';
import { openLink } from '../../../theme/utils/deeplink';
import { eachObject, mapFormat } from '../../../theme/utils';
import { emailValidate } from '../../../theme/validators';
import { ButtonEvent } from '../../../components/form';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-forum-thread',
    templateUrl: './thread.component.html',
    styleUrls: ['./thread.component.scss']
})
export class ThreadComponent {
    private readonly toastrService = inject(DialogService);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly service = inject(ForumService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly uploadService = inject(FileUploadService);
    private readonly searchService = inject(SearchService);
    private readonly themeService = inject(ThemeService);


    public readonly editor = viewChild(ForumEditorComponent);

    public readonly thread = signal<IThread>(null);
    public readonly items = signal<IThreadPost[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        user: 0,
        order: '',
        status: '0',
    }));

    public readonly user = signal<IUser>(null);
    public readonly dataModel = signal({
        content: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.content);
    });

    public readonly editForm = form(signal({
        remark: '',
        top_type: false,
        is_digest: false,
        is_highlight: false,
        is_closed: false
    }));
    public readonly rewardForm = form(signal({
        amount: 10,
    }));
    public statusItems = [$localize `None`, $localize `Reviewed`, $localize `Done`,  $localize `Positive`, $localize `Opposition`]
    public readonly statusForm = form(signal({
        selected: 0,
    }));

    constructor() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user.set(user);
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
        });
        this.route.params.subscribe(params => {
            this.service.getThread(params.id).subscribe(res => {
                this.themeService.titleChanged.next(res.title);
                if (res.classify && res.classify instanceof Array) {
                    res.classify = undefined;
                }
                this.thread.set(res);
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
        for (const it of this.items()) {
            if (it.user_id == userId) {
                it.is_loaded = loaded;
                if (info) {
                    it.user = info;
                }
            }
        }
    }

    public tapSeeUser(user: number = 0) {
        this.queries.user().value.set(user);
        this.tapRefresh();
    }

    public tapSortOrder() {
        this.queries().value.update(v => {
            v.order = v.order == 'desc' ? 'asc' : 'desc';
            return {...v};
        });
        this.tapRefresh();
    }

    public onStatusChange() {
        this.tapRefresh();
    }

    public open(modal: DialogEvent) {
        if (!this.thread || !this.user || !modal) {
            return;
        }
        this.editForm.remark().value.set('');
        const maps = {
            highlightable: 'is_highlight',
            digestable: 'is_digest',
            closeable: 'is_closed',
            topable: 'top_type',
        };
        eachObject(maps, (k, i) => {
            if (this.thread[i]) {
                this.editForm[k] = this.thread[k];
            }
        });
        modal.open(() => {
            this.service.threadAction(this.thread().id, this.editForm()).subscribe(res => {
                eachObject(maps, i => {
                    this.thread[i] = res[i];
                });
            });
        }, () => !emailValidate(this.editForm.remark().value()));
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
            this.uploadService.export('forum/thread/do', {
                id: item.id,
                index: block.uid,
            });
            return;
        }
    }

    public formatStatus(item: IThreadPost) {
        return mapFormat(item.status || 0, this.statusItems);
    }

    public tapChange(modal: DialogEvent, item: IThreadPost) {
        if (!this.thread().editable) {
            return;
        }
        this.statusForm.selected().value.set(item.status || 0);
        modal.open(() => {
            this.service.postChange({
                id: item.id,
                status: this.statusForm.selected().value()
            }).subscribe(res => {
                item.status = res.status;
            });
        });
    }

    public tapReply(item: IThreadPost) {
        const editor = this.editor();
        if (!editor) {
            return;
        }
        const element = document.querySelector('#post-editor');
        if (element) {
            element.scrollIntoView();
        }
        editor.insertAt(item.id, item.user.name);
    }

    public toggleLike() {
        this.service.threadAction(this.thread().id, [
            'like'
        ]).subscribe({
            next: res => {
                this.thread.update(v => {
                    return {...v, like_type: res.like_type};
                });
            },
            error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public toggleCollect() {
        this.service.threadAction(this.thread().id, [
            'collect'
        ]).subscribe({
            next: res => {
                this.thread.update(v => {
                    return {...v, is_collected: res.is_collected};
                });
            },
            error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapReward(modal: DialogEvent) {
        modal.open(() => {
            this.service.threadAction(this.thread().id, {
                reward: this.rewardForm.amount().value()
            }).subscribe({
                next: res => {
                    this.thread.update(v => {
                        return {...v, is_reward: res.is_reward};
                    });
                },
                error: err => {
                    this.toastrService.warning(err.error.message);
                }
            });
        }, () => this.rewardForm.amount().value() > 0);

    }


    public toggeTop() {
        this.service.threadAction(this.thread().id, ['top_type']).subscribe({
            next: res => {
                this.thread.update(v => {
                    return {...v, top_type: res.top_type};
                });
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
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `The content is not filled out completely`);
            return;
        }
        const data = {...this.dataForm().value(), thread: this.thread().id};
        e?.enter();
        this.service.postCreate(data).subscribe({
            next: res => {
                e?.reset();
                this.toastrService.success($localize `Reply successfully`);
                this.dataModel.set({
                    content: '',
                });
                if (this.queries.page().value() < 2) {
                    this.tapRefresh();
                }
            },
            error: (err: IErrorResult) => {
                e?.reset();
                if (err.error.code === 401) {
                    this.themeService.emitLogin();
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
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.getPostList({...queries, thread: this.thread().id}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.set(res.data);
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
