import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFilter, IPageQueries } from '../../../../theme/models/page';
import { ISortItem } from '../../../../theme/models/seo';
import { ICategory, IGoods } from '../../model';
import { SearchService } from '../../../../theme/services';
import { ShopService } from '../../shop.service';

@Component({
    standalone: false,
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(ShopService);
    private readonly searchService = inject(SearchService);


    public readonly category = signal<ICategory>(null);
    public readonly items = signal<IGoods[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        category: 0,
    }));
    public readonly filterItems = signal<IFilter[]>([]);
    public sortItems: ISortItem[] = [
        {name: '默认', value: ''},
        {name: '价格', value: 'price', asc: true},
        {name: '销量', value: 'sale', asc: false},
        {name: '评价', value: 'comment', asc: false},
    ];
    public readonly sortKey = signal('');
    public readonly orderAsc = signal(true);
    public readonly priceForm = form(signal({
        min: 0,
        max: 0
    }));

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            const category = this.queries.category().value();
            if (!this.category || category == this.category.id) {
                return;
            }
            this.tapRefresh();
            this.service.category(category).subscribe(res => {
                this.category.set(res);
            });
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
            const category = this.queries.category().value();
            if (category > 0) {
                this.service.category(category).subscribe(res => {
                    this.category.set(res);
                });
            }
        });
    }

    public tapSort(item: ISortItem) {
        if (this.sortKey() === item.value) {
            this.orderAsc.update(v => !v);
        } else {
            this.sortKey.set(item.value as string);
            this.orderAsc.set(!!item.asc);
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
        this.goPage(this.queries.page().value() + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.goodsList({...queries, filter: this.filterItems.length < 1}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.total.set(res.paging.total);
                this.items.set(res.data);
                this.queries().value.set(queries);
            this.searchService.applyHistory(queries, ['category']);
                if (res.filter) {
                    this.filterItems = res.filter;
                }
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
