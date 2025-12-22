import { Component, effect, inject, input, output, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IBlockItem } from '../../../../../components/link-rule';
import { openLink } from '../../../../../theme/utils/deeplink';
import { IComment } from '../../../model';
import { IUser } from '../../../../../theme/models/user';
import { BlogService } from '../../blog.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-comment-item',
    templateUrl: './comment-item.component.html',
    styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent {
    private readonly service = inject(BlogService);
    private readonly toastrService = inject(DialogService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);


    public readonly value = input<IComment>(undefined);
    public readonly user = input<IUser>(undefined);
    public readonly status = input(0);
    public readonly guestUser = input<any>({});
    public readonly commenting = output<any>();

    public readonly hasMore = signal(true);
    public readonly isLoading = signal(false);
    public readonly queries = form(signal({
        page: 1,
        per_page: 5,
        parent_id: 0,
        blog_id: 0,
        sort: 'created_at',
        order: 'asc',
    }));

    public expanded = false;
    public readonly editForm = form(signal({
        content: '',
        parent_id: 0,
        blog_id: 0,
    }));

    constructor() {
        effect(() => {
            const value = this.value();
            if (!value.replies) {
                value.replies = [];
            }
            untracked(() => {
                this.hasMore.set(value.reply_count > value.replies?.length);
                this.queries().value.update(v => {
                    v.blog_id = value.blog_id;
                    v.parent_id = value.id;
                    v.page = 1;
                    return v;
                });
            });
        });
    }

    public get moreCount() {
        if (!this.hasMore) {
            return 0;
        }
        return this.value().reply_count - this.value().replies.length;
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
            ...this.editForm().value(),
            ...this.guestUser(),
            next: () => {
                e?.reset();
                this.editForm().value.update(v => {
                    v.content = '';
                    v.parent_id = 0;
                    return v;
                });
            },
            error: () => {
                e?.reset();
            }
        });
    }

    public tapCommenting(item?: IComment) {
        this.editForm().value.update(v => {
             if (item) {
                v.blog_id = item.blog_id;
                if (item.parent_id > 0) {
                    v.content += `@${item.position}# `;
                }
            }
            v.parent_id = item?.id || 0;
            return v;
        });
       
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
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.commentList({...queries}).subscribe({
            next: res => {
                this.hasMore.set(res.paging.more);
                this.isLoading.set(false);
                this.value().replies = [].concat(this.value().replies, res.data);
                this.queries().value.set(queries);
            }, 
            error: () => {
                this.isLoading.set(false);
            }
        });
    }
}
