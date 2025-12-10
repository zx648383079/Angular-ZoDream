import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { IForum, IThread } from '../../model';
import { ForumService } from '../forum.service';
import { SwiperEvent } from '../../../../components/swiper';
import { mapFormat } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-thread',
    templateUrl: './thread.component.html',
    styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
    private service = inject(ForumService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);

    public items: IThread[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        forum: 0
    };
    public forum: IForum;
    public isMultiple = false;
    public isChecked = false;
    public isReview = false;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            if (this.queries.forum < 1 || this.forum?.id === this.queries.forum) {
                this.tapPage();
                return;
            }
            this.service.forum(this.queries.forum).subscribe(res => {
                this.forum = res;
                this.tapPage();
            });
        });
    }

    public get checkedItems() {
        return this.items.filter(i => i.checked);
    }

    public toggleCheck(item?: IThread) {
        if (!item) {
            this.isChecked = !this.isChecked;
            this.items.forEach(i => {
                i.checked = this.isChecked;
            });
            return;
        }
        item.checked = !item.checked;
        if (!item.checked) {
            this.isChecked = false;
            return;
        }
        if (this.checkedItems.length === this.items.length) {
            this.isChecked = true;
        }
    }

    public tapRemoveMultiple() {
        const items = this.checkedItems;
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
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.threadList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.isChecked = false;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
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
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }
}
