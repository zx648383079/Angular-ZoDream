import { form } from '@angular/forms/signals';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IComment } from '../../model';
import { SearchService } from '../../../../theme/services';
import { BlogService } from '../blog.service';
import { SwiperEvent } from '../../../../components/swiper';
import { mapFormat } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
    private readonly service = inject(BlogService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IComment[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
        user: 0,
        blog: 0,
    }));
    public readonly isMultiple = signal(false);
    public readonly isChecked = signal(false);
    public readonly isReview = signal(false);

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public readonly checkedItems = computed(() => {
        return this.items().filter(i => i.checked);
    });

    public toggleReview() {
        this.isReview.update(v => !v);
    }
    public toggleMultiple() {
        this.isMultiple.update(v => !v);
    }

    public toggleCheck(item?: IComment) {
        if (!item) {
            this.isChecked.update(v => !v);
            const isChecked = this.isChecked();
            this.items.update(v => {
                return v.map(i => {
                    i.checked = isChecked;
                    return i;
                });
            });
            return;
        }
        item.checked = !item.checked;
        this.items.update(v => [...v]);
        if (!item.checked) {
            this.isChecked.set(false);
            return;
        }
        if (this.checkedItems().length === this.items().length) {
            this.isChecked.set(true);
        }
    }

    public tapRemoveMultiple() {
        const items = this.checkedItems();
        if (items.length < 1) {
            this.toastrService.warning($localize `No item selected!`);
            return;
        }
        this.toastrService.confirm(`确认删除选中的${items.length}条评论？`, () => {
            this.service.commentRemove(items.map(i => i.id)).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.tapPage();
            });
        });
    }

    public formatStatus(val?: number) {
        return mapFormat(val, [
            {name: '待审核', value: 0},
            {name: '通过', value: 1},
            {name: '拒绝', value: 9}
        ]);
    }

    public tapUser(userId: number) {
        this.queries.user().value.set(userId);
        this.tapRefresh();
    }

    public tapApproved(item: IComment, ctl?: SwiperEvent) {
        this.service.commentToggle({
            id: item.id
        }).subscribe({
            next: res => {
                item.approved = res.approved;
                if (ctl) {
                    this.tapNext(ctl);
                } else {
                    this.items.update(v => [...v]);
                }
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapPrevious(ctl: SwiperEvent) {
        if (ctl.backable) {
            ctl.back();
            return;
        }
        const page = this.queries.page().value();
        if (page > 1) {
            this.goPage(page - 1);
        }
    }

    public tapNext(ctl: SwiperEvent) {
        if (ctl.nextable) {
            ctl.next();
            return;
        }
        if (this.hasMore) {
            this.tapMore();
        }
    }

    public tapRefresh() {
        this.goPage(1);
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
        this.service.getComment(queries).subscribe({
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

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IComment) {
        this.toastrService.confirm('确定删除“' + item.content + '”评论？', () => {
            this.service.commentRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

}
