import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFilter, IPageQueries } from '../../../theme/models/page';
import { ISortItem } from '../../../theme/models/seo';
import { ICategory, IGoods } from '../../../theme/models/shop';
import { applyHistory, getQueries } from '../../../theme/query';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public category: ICategory;
    public items: IGoods[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        category: 0,
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
    public price = {
        min: '',
        max: ''
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: ShopService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.queries.category = parseInt(params.id, 10);
        });
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
            if (this.queries.category > 0) {
                this.service.category(this.queries.category).subscribe(res => {
                    this.category = res;
                });
            }
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

    public tapFilter(key: string, val: string) {
        this.queries[key] = val;
        for (const item of this.filterItems) {
            if (item.name !== key) {
                continue;
            }
            for (const it of item.items) {
                it.selected = it.value === val;
            }
        }
        this.tapRefresh();
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
                applyHistory(this.queries = queries);
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
