import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageQueries } from '../../../../../../theme/models/page';
import { SearchService } from '../../../../../../theme/services';
import { IAffiliateLog } from '../../../../model';
import { AffiliateService } from '../affiliate.service';

@Component({
    standalone: false,
    selector: 'app-log',
    templateUrl: './log.component.html',
    styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

    public items: IAffiliateLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };

    constructor(
        private service: AffiliateService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }


    /**
    * tapRefresh
    */
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
        this.service.logList(queries).subscribe({
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

}
