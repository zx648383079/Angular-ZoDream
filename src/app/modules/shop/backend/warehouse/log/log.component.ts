import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { IWarehouseLog } from '../../../model';
import { SearchService } from '../../../../../theme/services';
import { WarehouseService } from '../warehouse.service';

@Component({
    standalone: false,
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

    public items: IWarehouseLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        warehouse: 0,
    };

    constructor(
        private service: WarehouseService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.searchService.getQueries(params, this.queries)
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
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
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries, ['warehouse']);
            },
            error: err => {
                this.toastrService.error(err);
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }
}
