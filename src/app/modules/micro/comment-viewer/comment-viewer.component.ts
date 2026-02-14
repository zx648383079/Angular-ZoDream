import { Component, effect, HostListener, inject, input, output, signal } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { IErrorResponse } from '../../../theme/models/page';
import { IEmoji } from '../../../theme/models/seo';
import { IUser } from '../../../theme/models/user';
import { MicroService } from '../micro.service';
import { IComment } from '../model';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-comment-viewer',
    templateUrl: './comment-viewer.component.html',
    styleUrls: ['./comment-viewer.component.scss']
})
export class CommentViewerComponent {
    private readonly toastrService = inject(DialogService);
    private readonly service = inject(MicroService);


    public readonly open = input(false);
    public readonly user = input<IUser>(undefined);
    public readonly micro = input(0);
    public readonly auto = input(false);
    public readonly loadMore = output<void>();
    public readonly items = signal<IComment[]>([]);
    public readonly hasMore = signal(true);
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = signal({
        page: 1,
        per_page: 20
    });
    private booted = false;

    public readonly editForm = form(signal({
        content: '',
        parent_id: 0,
        is_forward: false,
    }));

    @HostListener('scroll', [
        '$event',
    ])
    public onDivScroll(
        event: Event
    ): void {
        if (!this.auto()) {
            return;
        }
        const target = event.target as HTMLElement;
        const height = target.scrollHeight;
        const y = target.scrollTop + target.offsetHeight;
        if (this.hasMore && y + 50 > height) {
            this.tapMore();
        }
    }

    constructor() {
        effect(() => {
            this.open();
            this.micro();
            this.init();
        });
    }

    private init() {
        if (this.booted) {
            return;
        }
        if (this.micro() < 1 || !this.open()) {
            return;
        }
        this.booted = true;
        this.tapRefresh();
    }

    public tapEmoji(item: IEmoji) {
        this.editForm.content().value.update(v => v + (item.type > 0 ? item.content : '[' + item.name + ']'));
    }

    public toggleForward() {
        this.editForm.is_forward().value.update(v => !v);
    }

    public tapComment() {
        if (this.editForm.content().value().length < 1) {
            this.toastrService.warning($localize `Please input content`);
            return;
        }
        if (this.micro() < 1) {
            this.toastrService.warning($localize `operation failed`);
            return;
        }
        const data = Object.assign({micro_id: this.micro()}, this.editForm().value());
        this.service.commentSave(data).subscribe({
            next: _ => {
                this.toastrService.success($localize `Successful comment`);
                this.editForm().value.update(v => {
                    v.parent_id = 0;
                    v.content = '';
                    return {...v};
                });
            }, 
            error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }

    public tapCommenting(item?: IComment) {
        this.editForm().value.update(v => {
            v.parent_id = item?.id || 0;
            v.content = '回复 @' + item.user.name;
            return {...v};
        });
    }

    public onCommentChange() {
        if (this.editForm.parent_id().value() < 1) {
            return;
        }
        if (this.editForm.content().value().indexOf('回复 @') !== 0) {
            this.editForm.parent_id().value.set(0);
        }
    }

    public tapAgreeComment(item: IComment) {
        this.service.commentAgree(item.id).subscribe(res => {
            item.agree = res.agree;
            item.agree_type = res.agree_type;
            item.disagree = res.disagree;
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        if (!this.auto()) {
            this.loadMore.emit();
            return;
        }
        this.goPage(this.queries().page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.commentList({
            ...this.queries(),
            id: this.micro(),
            page
        }).subscribe({
            next: res => {
                this.hasMore.set(res.paging.more);
                this.isLoading.set(false);
                this.items.update(v => {
                    if (page < 2) {
                        return res.data;
                    }
                    return [...v, ...res.data];
                });
                this.total.set(res.paging.total);
                this.queries.update(v => {
                    v.page = page;
                    return v;
                });
            }, 
            error: () => {
                this.isLoading.set(false);
            }
        });
    }
}
