import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    IThread, IThreadPost
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
} from '../../theme/interfaces';
import {
    getCurrentUser
} from '../../theme/reducers/auth.selectors';
import {
    IUser
} from '../../theme/models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IErrorResult, IPageQueries } from '../../theme/models/page';
import { applyHistory, getQueries } from '../../theme/query';
import { ForumEditorComponent } from '../forum-editor/forum-editor.component';
import { DownloadService } from '../../theme/services';
import { openLink } from '../../theme/deeplink';
import { DialogBoxComponent } from '../../theme/components';
import { eachObject } from '../../theme/utils';
import { emailValidate } from '../../theme/validators';

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
    };

    public user: IUser;
    public form = this.fb.group({
        content: ['', Validators.required], 
    });

    public editData: any = {};

    constructor(
        private fb: FormBuilder,
        private toastrService: ToastrService,
        private store: Store<AppState>,
        private service: ForumService,
        private route: ActivatedRoute,
        private router: Router,
        private downloadService: DownloadService,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
        });
        this.route.params.subscribe(params => {
            this.service.getThread(params.id).subscribe(res => {
                if (res.classify && res.classify instanceof Array) {
                    res.classify = undefined;
                }
                this.thread = res;
                this.tapRefresh();
            });
        });
    }

    public tapSeeUser(user: number = 0) {
        this.queries.user = user;
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
                this.toastrService.warning('请选择投票项');
                return;
            }
            this.service.postDo({
                id: item.id,
                index: block.uid,
                data: block.max > 1 ? items : items[0]
            }).subscribe(res => {
                item.content = res.data.content;
                this.toastrService.success('投票成功');
            }, (err: IErrorResult) => {
                this.toastrService.warning(err.error.message);
            });
            return;
        }
        if (block.tag === 'hide_buy' || block.tag === 'file_buy') {
            this.service.postDo({
                id: item.id,
                index: block.uid,
            }).subscribe(res => {
                if (res.data) {
                    item.content = res.data.content;
                }
                this.toastrService.success('支付成功');
            }, (err: IErrorResult) => {
                this.toastrService.warning(err.error.message);
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


    public toggeTop() {
        this.service.threadAction(this.thread.id, {
            0: 'top_type'
        }).subscribe(res => {
            this.thread.top_type = res.top_type;
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapRemove(item: IThreadPost) {
        if (!confirm('确定删除回帖？')) {
            return;
        }
        this.service.postRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('内容没填写完整');
            return;
        }
        const data = {...this.form.value, thread_id: this.thread.id};
        this.service.postCreate(data).subscribe(res => {
            this.toastrService.success('回复成功');
            this.form.patchValue({
                content: '',
            });
            if (this.queries.page < 2) {
                this.tapRefresh();
            }
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
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
        this.service.getPostList({...queries, thread: this.thread.id}).subscribe(res => {
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = res.data;
            applyHistory(this.queries = queries);
        }, () => {
            this.isLoading = false;
        });
    }

}
