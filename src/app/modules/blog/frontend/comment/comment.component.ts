import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { AppState } from '../../../../theme/interfaces';
import {
    IComment
} from '../../model';
import { IPageQueries } from '../../../../theme/models/page';
import { IUser } from '../../../../theme/models/user';
import { selectAuthUser } from '../../../../theme/reducers/auth.selectors';
import { emptyValidate } from '../../../../theme/validators';
import { BlogService } from '../blog.service';
import { SearchService } from '../../../../theme/services';
import { eachObject } from '../../../../theme/utils';

const GuestUserKey = 'gu';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnChanges {

    @Input() public itemId = 0;
    @Input() public init = false;
    @Input() public status = 0;

    public hotItems: IComment[] = [];
    public items: IComment[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
        sort: 'created_at',
        order: 'desc',
    };
    private booted = 0;
    public user: IUser;

    public commentData = {
        content: '',
        parent_id: 0,
    };
    public guestUser = {
        name: '',
        email: '',
        url: '',
    };


    constructor(
        private service: BlogService,
        private toastrService: DialogService,
        private searchService: SearchService,
        private store: Store<AppState>,
    ) {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user;
        });
        this.loadGuestUser();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.init && changes.init.currentValue && this.itemId > 0 && this.booted !== this.itemId) {
            this.boot();
        }
    }

    private boot() {
        this.booted = this.itemId;
        if (this.itemId < 1) {
            return;
        }
        this.service.commentList({
            blog_id: this.itemId,
            is_hot: true,
            per_page: 5,
        }).subscribe(res => {
            this.hotItems = res.data;
        });
        this.tapRefresh();
    }

    public tapLogin() {
        this.searchService.emitLogin(true);
    }

    public onReply(data: any) {
        if (this.status === 2 && !this.user) {
            this.tapLogin();
            data.error();
            return;
        }
        if (emptyValidate(this.commentData.content)) {
            this.toastrService.warning($localize `Please input content`);
            data.error();
            return;
        }
        if (!this.user) {
            eachObject(this.guestUser, (_, k) => {
                this.guestUser[k] = data[k];
            });
        }
        const commentData = {...data, blog_id: this.itemId};
        delete commentData['next'], commentData['error'];
        this.service.commentSave(commentData).subscribe({
            next: _ => {
                this.toastrService.success($localize `Comment successful`);
                this.saveGuestUser();
                data.next();
            }, 
            error: err => {
                this.toastrService.warning(err);
                data.error();
            }
        });
    }
    
    public tapComment(e?: ButtonEvent) {
        if (this.status === 2 && !this.user) {
            this.tapLogin();
            return;
        }
        if (emptyValidate(this.commentData.content)) {
            this.toastrService.warning($localize `Please input content`);
            return;
        }
        const data = Object.assign({blog_id: this.itemId}, this.commentData);
        if (!this.user) {
            eachObject(this.guestUser, (v, k) => {
                data[k] = v;
            });
        }
        e?.enter();
        this.service.commentSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Comment successful`);
                this.commentData.content = '';
                this.commentData.parent_id = 0;
                this.saveGuestUser();
            }, 
            error: err => {
                e?.reset();
                this.toastrService.warning(err);
            }
        });
    }

    public tapSort(sort: string) {
        this.queries.order = sort;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.commentList({...queries, blog_id: this.itemId}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.total = res.paging.total;
                this.items = res.data;
                this.queries = queries;
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

    private loadGuestUser() {
        const str = window.localStorage.getItem(GuestUserKey);
        if (!str) {
            return;
        }
        this.guestUser = JSON.parse(str);
    }

    private saveGuestUser() {
        if (emptyValidate(this.guestUser.name)) {
            return;
        }
        window.localStorage.setItem(GuestUserKey, JSON.stringify(this.guestUser));
    }
}
