import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFilter, IPageQueries } from '../../../../theme/models/page';
import { ISortItem } from '../../../../theme/models/seo';
import { IGoods } from '../../model';
import { SearchService } from '../../../../theme/services';
import { ShopService } from '../../shop.service';

@Component({
    standalone: false,
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly service = inject(ShopService);
    private searchService = inject(SearchService);


    public items: IGoods[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        category: 0,
        keywords: '',
    };
    public filterItems: IFilter[] = [];
    public sortItems: ISortItem[] = [
        {name: $localize `Default`, value: ''},
        {name: $localize `Price`, value: 'price', asc: true},
        {name: $localize `Sales`, value: 'sale', asc: false},
        {name: $localize `Evaluation`, value: 'comment', asc: false},
    ];
    public sortKey = '';
    public orderAsc = true;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapSort(item: ISortItem) {
        if (this.sortKey === item.value) {
            this.orderAsc = !this.orderAsc;
        } else {
            this.sortKey = item.value as string;
            this.orderAsc = !!item.asc;
        }
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.goodsList({...queries, filter: this.filterItems.length < 1}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.total = res.paging.total;
                this.items = res.data;
                this.searchService.applyHistory(this.queries = queries);
                if (res.filter) {
                    this.filterItems = res.filter;
                }
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
