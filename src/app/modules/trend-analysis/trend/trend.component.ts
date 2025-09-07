import { Component, OnInit } from '@angular/core';
import { IPageQueries } from '../../../theme/models/page';
import { TrendService } from '../trend.service';
import { DialogService } from '../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../theme/services';
import { IPageAccessLog, TimeTabItems } from '../model';
import { getTimeRange } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-trend',
    templateUrl: './trend.component.html',
    styleUrls: ['./trend.component.scss']
})
export class TrendComponent implements OnInit {

    public items: IPageAccessLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        start_at: '',        
        end_at: '',
        page: 1,
        per_page: 20
    };
    public tabItems = TimeTabItems;
    public tabIndex = -1;
    public moreOpen = false;

    constructor(
        private service: TrendService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapTime(val: number) {
        this.tabIndex = val;
        const range = getTimeRange(val, 0);
        this.queries.start_at = range[0];
        this.queries.end_at = range[1];
        this.tapRefresh();
    }

    public isMask(key: string, value: string): boolean {
        return false;
    }

    public toggleOpen(item: IPageAccessLog) {
        if (item.is_open) {
            item.is_open = false;
            return;
        }
        for (const it of this.items) {
            it.is_open = item === it;
        }
    }

    public tapFilter(key: string, value: string) {

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
        const queries: any = {...this.queries, page};
        this.service.logList(queries).subscribe({
            next: res => {
                this.items = res.data.reverse();
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tabIndex = -1;
        this.tapRefresh();
    }

}
