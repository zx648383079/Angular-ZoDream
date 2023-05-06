import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { TrendService } from '../trend.service';
import { TimeTabItems } from '../model';

@Component({
    selector: 'app-trend-source',
    templateUrl: './source.component.html',
    styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {

    public items: any[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        start_at: '',        
        end_at: '',
        type: '',
        page: 1,
        per_page: 20
    };
    public tabItems = TimeTabItems;
    public tabIndex = '';

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

    public get headerTitle() {
        switch (this.queries.type) {
            case 'engine':
                return '搜索引擎';
            case 'keywords':
                return '搜索词';
            case 'link':
                return '外部链接';
            default:
                return '来源类型';
        }
    }

    public getHeaderValue(item: any) {
         switch (this.queries.type) {
            case 'engine':
                
            case 'keywords':
                return item.words;
            case 'link':
                return item.host;
            default:
                return item.host;
        }
    }

    public tapTab(val: string) {
        this.tabIndex = val;
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
        if (this.tabIndex != '') {
            queries.start_at = this.tabIndex;
            queries.end_at = '';
        }
        this.service.sourceList(queries).subscribe({
            next: res => {
                this.items = res.data;
                if (res.paging) {
                    this.hasMore = res.paging.more;
                    this.total = res.paging.total;
                }
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
        this.tabIndex = '';
        this.tapRefresh();
    }

}
