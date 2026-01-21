import { form } from '@angular/forms/signals';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { SearchService } from '../../../../theme/services';
import { IForum, IThread } from '../../model';
import { ForumService } from '../forum.service';
import { SwiperEvent } from '../../../../components/swiper';
import { mapFormat } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-forum-b-thread',
    templateUrl: './thread.component.html',
    styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
    private readonly service = inject(ForumService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);

    public readonly items = signal<IThread[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
        forum: 0
    }));
    public forum: IForum;
    public readonly isMultiple = signal(false);
    public readonly isChecked = signal(false);
    public readonly isReview = signal(false);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            const forum = this.queries.forum().value();
            if (forum < 1 || this.forum?.id === forum) {
                this.tapPage();
                return;
            }
            this.service.forum(this.queries.forum).subscribe(res => {
                this.forum = res;
                this.tapPage();
            });
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

    public toggleCheck(item?: IThread) {
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
        this.toastrService.confirm(`确认删除选中的${items.length}条帖子？`, () => {
            this.service.threadRemove(items.map(i => i.id)).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.tapPage();
            });
        });
    }

    public formatStatus(val: number) {
        return mapFormat(val, [
            {name: '待审核', value: 0},
            {name: '通过', value: 1},
            {name: '拒绝', value: 9}
        ]);
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.threadList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.isChecked.set(false);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapReview(ctl: SwiperEvent, item: IThread, status: number) {
        this.service.threadChange({
            id: item.id,
            status
        }).subscribe(_ => {
            item.status = status;
            ctl.next();
        });
    }

    public tapRemove(item: IThread) {
        this.toastrService.confirm('确定删除“' + item.title + '”帖子？', () => {
            this.service.threadRemove(item.id).subscribe(res => {
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
