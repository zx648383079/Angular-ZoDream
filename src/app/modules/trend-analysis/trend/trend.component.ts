import { Component, OnInit, inject } from '@angular/core';
import { IPageQueries } from '../../../theme/models/page';
import { TrendService } from '../trend.service';
import { DialogService } from '../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../theme/services';
import { IAnalysisMark, IPageAccessLog, TimeTabItems } from '../model';
import { formatDate, getTimeRange } from '../../../theme/utils';

interface ILogGroup {
    name: string;
    items: IPageAccessLog[];
}

@Component({
    standalone: false,
    selector: 'app-trend',
    templateUrl: './trend.component.html',
    styleUrls: ['./trend.component.scss']
})
export class TrendComponent implements OnInit {
    private service = inject(TrendService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: ILogGroup[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        start_at: '',        
        end_at: '',
        page: 1,
        per_page: 20
    };
    public tabItems = TimeTabItems;
    public tabIndex = -1;
    public moreOpen = false;
    public markItems: IAnalysisMark[] = [];

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapGoto(time?: string) {
        if (time) {
            this.queries = {
                keywords: '',
                start_at: '',        
                end_at: '',
                page: 1,
                per_page: 20,
                goto: time,
            };
        } else {
            this.queries.goto = this.queries.start_at;
            this.queries.start_at = '';
        }
        this.tapRefresh();
    }

    public tapReset() {
        this.queries = {
            keywords: '',
            start_at: '',        
            end_at: '',
            page: 1,
            per_page: 20,
        };
        this.tapRefresh();
    }

    public tapTime(val: number) {
        this.tabIndex = val;
        const range = getTimeRange(val, 0);
        this.queries.start_at = range[0];
        this.queries.end_at = range[1];
        this.tapRefresh();
    }

    public isMark(key: string, value: string): boolean {
        for (const item of this.markItems) {
            if (this.isEqual(item, key, value)) {
                return true;
            }
        }
        return false;
    }

    private isEqual(item: IAnalysisMark, key: string, value: string): boolean {
        return item.key === key && item.value === value;
    }

    public tapUnmark(key: string, value: string) {
        this.markItems = this.markItems.filter(item => !this.isEqual(item, key, value));
    }

    public tapMark(key: string, value: string) {
        this.markItems.push({
            key,
            value
        });
    }

    public toggleOpen(item: IPageAccessLog) {
        if (item.is_open) {
            item.is_open = false;
            return;
        }
        this.forEach(it => it.is_open = item === it);
    }

    public tapFilter(key: string, value: string) {
        this.queries[key] = value;
        this.tapRefresh();
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
                this.items = this.formatGroup(res.data.reverse());
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.isLoading = false;
                if (queries.goto) {
                    queries.page = res.paging.offset;
                    queries.per_page = res.paging.limit;
                    delete queries['goto'];
                }
                this.searchService.applyHistory(this.queries = queries);
                
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


    private formatGroup(items: IPageAccessLog[]): ILogGroup[] {
        const res: ILogGroup[] = [];
        let last: ILogGroup = null;
        for (const item of items) {
            const current = formatDate(item.created_at, 'yyyy-mm-dd');
            if (current !== last?.name) 
            {
                res.push(last = {
                    name: current,
                    items: []
                });
            }
            last.items.push(item);
        }
        return res;
    }

    private forEach(cb: (item: IPageAccessLog) => void) {
        for (const group of this.items) {
            for (const item of group.items) {
                cb(item);
            }
        }
    }

}
