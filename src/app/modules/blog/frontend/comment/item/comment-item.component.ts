import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IBlockItem } from '../../../../../components/link-rule';
import { openLink } from '../../../../../theme/utils/deeplink';
import { IComment } from '../../../model';
import { IUser } from '../../../../../theme/models/user';
import { BlogService } from '../../blog.service';

@Component({
    standalone: false,
    selector: 'app-comment-item',
    templateUrl: './comment-item.component.html',
    styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnChanges {

    @Input() public value: IComment;
    @Input() public user: IUser;
    @Input() public status = 0;
    @Input() public guestUser: any = {};
    @Output() public commenting = new EventEmitter<any>();

    public hasMore = true;
    public isLoading = false;
    public queries = {
        page: 1,
        per_page: 5,
        parent_id: 0,
        blog_id: 0,
        sort: 'created_at',
        order: 'asc',
    };

    public expanded = false;
    public editData = {
        content: '',
        parent_id: 0,
        blog_id: 0,
    };

    constructor(
        private service: BlogService,
        private toastrService: DialogService,
        private router: Router,
        private route: ActivatedRoute) { }

    public get moreCount() {
        if (!this.hasMore) {
            return 0;
        }
        return this.value.reply_count - this.value.replies.length;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            if (!this.value.replies) {
                this.value.replies = [];
            }
            this.hasMore = this.value.reply_count > this.value.replies?.length;
            this.queries.blog_id = this.value.blog_id;
            this.queries.parent_id = this.value.id;
            this.queries.page = 1;
        }
        
    }

    public toggleExpand() {
        this.expanded = !this.expanded;
    }

    public tapBlock(item: IBlockItem) {
        if (item.user) {
            this.router.navigate(['../'], {relativeTo: this.route, queryParams: {
                user: item.user
            }});
            return;
        }
        if (item.link) {
            openLink(this.router, item.link);
            return;
        }
    }

    public tapComment(e?: ButtonEvent) {
        e?.enter();
        this.commenting.emit({
            ...this.editData,
            ...this.guestUser,
            next: () => {
                e?.reset();
                this.editData.content = '';
                this.editData.parent_id = 0;
            },
            error: () => {
                e?.reset();
            }
        });
    }

    public tapCommenting(item?: IComment) {
        if (item) {
            this.editData.blog_id = item.blog_id;
            if (item.parent_id > 0) {
                this.editData.content += `@${item.position}# `;
            }
        }
        this.editData.parent_id = item?.id || 0;
    }

    public tapReport(item: IComment) {
        this.toastrService.confirm($localize `Sure to report the comment "${item.content}"?`, () => {
            this.service.commentReport(item.id).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Successfully reported the comment, pending review`);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapAgree(item: IComment) {
        this.service.commentAgree(item.id).subscribe(res => {
            item.agree_count = res.agree_count;
            item.disagree_count = res.disagree_count;
        });
    }

    public tapDisagree(item: IComment) {
        this.service.commentDisagree(item.id).subscribe(res => {
            item.agree_count = res.agree_count;
            item.disagree_count = res.disagree_count;
        });
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
        this.service.commentList({...queries}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.value.replies = [].concat(this.value.replies, res.data);
                this.queries = queries;
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }
}
