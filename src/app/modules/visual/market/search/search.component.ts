import { Component, OnInit } from '@angular/core';
import { IFilter, IPageQueries } from '../../../../theme/models/page';
import { ISortItem } from '../../../../theme/models/seo';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../theme/services';
import { VisualService } from '../visual.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    public items: any[] = [];
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
        {name: '默认', value: ''},
        {name: '价格', value: 'price', asc: true},
        {name: '销量', value: 'sale', asc: false},
        {name: '评价', value: 'comment', asc: false},
    ];
    public sortKey = '';
    public orderAsc = true;

    constructor(
        private route: ActivatedRoute,
        private service: VisualService,
        private searchService: SearchService,
    ) { }

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
        this.service.search({...queries, filter: this.filterItems.length < 1}).subscribe({
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
