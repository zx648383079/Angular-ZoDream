import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { AppState } from '../../../../theme/interfaces';
import { IPageQueries } from '../../../../theme/models/page';
import { IUser } from '../../../../theme/models/user';
import { getCurrentUser } from '../../../../theme/reducers/auth.selectors';
import { emptyValidate } from '../../../../theme/validators';
import { IComment } from '../../model';
import { ResourceService } from '../../resource.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
    @Input() public itemId = 0;
    @Input() public init = false;
    public items: IComment[] = [];
    public subtotal: any;
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
    public commentData = {
        content: '',
        parent_id: 0,
    };
    public user: IUser;

    constructor(
        public service: ResourceService,
        private store: Store<AppState>,
        private toastrService: DialogService,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user;
        });
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
        this.tapRefresh();
    }

    public tapComment(e?: ButtonEvent) {
        if (!this.user) {
            this.toastrService.warning($localize `Please login in first`);
            return;
        }
        if (emptyValidate(this.commentData.content)) {
            this.toastrService.warning($localize `Please input content`);
            return;
        }
        e?.enter();
        this.service.commentSave({...this.commentData, resource: this.itemId}).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Comment successful`);
                this.commentData.content = '';
                this.commentData.parent_id = 0;
            }, 
            error: err => {
                e?.reset();
                this.toastrService.warning(err);
            }
        })
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
        this.service.commentList({...queries, resource: this.itemId}).subscribe({
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

}
