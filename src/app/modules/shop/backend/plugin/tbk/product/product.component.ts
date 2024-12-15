import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageQueries } from '../../../../../../theme/models/page';
import { SearchService } from '../../../../../../theme/services';
import { TbkService } from '../tbk.service';

@Component({
    standalone: false,
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

    public items: any[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
    };

    constructor(
        private service: TbkService,
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
        this.service.search(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.data.length >= this.queries.per_page;
                this.total = (this.hasMore ? page + 1 : page) * this.queries.per_page;
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

}
