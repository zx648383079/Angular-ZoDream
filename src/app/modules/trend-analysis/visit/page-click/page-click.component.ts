import { Component, OnInit } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { SearchService } from '../../../../theme/services';
import { TrendService } from '../../trend.service';

@Component({
    selector: 'app-trend-page-click',
    templateUrl: './page-click.component.html',
    styleUrls: ['./page-click.component.scss']
})
export class PageClickComponent implements OnInit {

    public items: any[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };

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
        this.service.trendRealTime(queries).subscribe({
            next: res => {
                this.items = res.data;
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
        this.tapRefresh();
    }

}
