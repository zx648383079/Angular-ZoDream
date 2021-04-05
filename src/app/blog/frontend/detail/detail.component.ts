import {
    Component,
    OnInit
} from '@angular/core';
import {
    DomSanitizer,
    SafeHtml
} from '@angular/platform-browser';
import {
    BlogService
} from '../blog.service';
import {
    ActivatedRoute,
    Router
} from '@angular/router';
import {
    IBlog,
    IComment
} from '../../../theme/models/blog';
import { Store } from '@ngrx/store';
import { AppState } from '../../../theme/interfaces';
import { getCurrentUser } from '../../../theme/reducers/auth.selectors';
import { IUser } from '../../../theme/models/user';
import { ToastrService } from 'ngx-toastr';
import { IErrorResponse } from '../../../theme/models/page';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public content: SafeHtml;

    public data: IBlog;

    public commentItems: IComment[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;
    public commentSort = 'new';

    public user: IUser;

    public commentData = {
        name: '',
        email: '',
        url: '',
        content: '',
        parent_id: 0,
    };

    constructor(
        private sanitizer: DomSanitizer,
        private service: BlogService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: ToastrService,
        private store: Store<AppState>,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(param => {
            if (!param.id) {
                this.router.navigate(['../']);
                return;
            }
            this.loadBlog(param.id);
        });
    }

    loadBlog(id: number) {
        if (this.data && this.data.id === id) {
            return;
        }
        this.service.getDetail(id).subscribe(res => {
            this.data = res;
            this.content = this.sanitizer.bypassSecurityTrustHtml(res.content);
            document.documentElement.scrollTop = 0;
            if (res.comment_status > 0) {
                this.tapRefresh();
            }
        });
    }

    public tapComment() {
        if (this.commentData.content.length < 1) {
            this.toastrService.warning('请输入内容');
            return;
        }
        const data = Object.assign({blog_id: this.data.id}, this.commentData);
        this.service.commentSave(data).subscribe(_ => {
            this.toastrService.success('评论成功！');
            this.commentData.content = '';
            this.commentData.parent_id = 0;
        }, err => {
            const res = err.error as IErrorResponse;
            this.toastrService.warning(res.message);
        });
    }

    public tapCommenting(item?: IComment) {
        this.commentData.parent_id = item?.id || 0;
    }

    public tapSortComment(sort: string) {
        this.commentSort = sort;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.commentList({
            blog_id: this.data.id,
            sort: 'created_at',
            order: this.commentSort === 'new' ? 'desc' : 'asc',
            page
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.commentItems = res.data;
            this.total = res.paging.total;
            this.perPage = res.paging.limit;
        }, () => {
            this.isLoading = false;
        });
    }
}
