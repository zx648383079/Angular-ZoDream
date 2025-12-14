import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IFilter, IFilterOptionItem, IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';
import { AppStoreService } from '../app-store.service';
import { ISoftware } from '../model';

export interface IFilterTag {
    label: string,
    name: string,
}

@Component({
    standalone: false,
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    private readonly service = inject(AppStoreService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
        category: 0,
        user: 0,
        tag: '',
        price: '',
        sort: '',
        order: '',
    }));
    public keywords = '';
    public items: ISoftware[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public filterItems: IFilter[] = [];
    public viewTable = true;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.searchService.getQueries(params, this.queries);
            this.keywords = this.queries.keywords().value();
            this.tapPage();
        });
    }

    public get selectedFilters() {
        const items: IFilterTag[] = [];
        if (!emptyValidate(this.queries.keywords().value())) {
            items.push({
                name: 'keywords',
                label: `${this.queries.keywords}`
            });
        }
        for (const item of this.filterItems) {
            const labels: string[] = [];
            for (const it of item.items) {
                if (it.selected) {
                    labels.push(`${it.label}`);
                }
            }
            if (labels.length > 0) {
                items.push({
                    name: item.name,
                    label: `${item.label}: ${labels.join(',')}`
                });
            }
        }
        return items;
    }

    public tapPrice(item: IFilter) {
        for (const it of item.items) {
            it.selected = false;
        }
        this.queries.price = `${item.min}-${item.max}`;
        this.tapRefresh();
    }

    public tapFilterItem(item: IFilter, it: IFilterOptionItem) {
        if (!item.multiple) {
            for (const i of item.items) {
                i.selected = it.value === i.value;
            }
            this.queries[item.name] = it.value;
            this.tapRefresh();
            return;
        }
        const value = [];
        for (const i of item.items) {
            if (i.value === it.value) {
                i.selected = !i.selected;
            }
            if (i.selected) {
                value.push(i.value);
            }
        }
        this.queries[item.name] = value.join(',');
        this.tapRefresh();
    }

    public tapUser(user: number) {
        this.queries.user = user;
        this.tapRefresh();
    }

    public tapCategory(cat: number) {
        this.queries.category = cat;
        this.tapRefresh();
    }

    public tapClearQuery() {
        this.keywords = '';
    }

    public tapRemoveFilter(name: string) {
        this.queries[name] = name === 'category' || name === 'user' ? 0 : '';
        for (const item of this.filterItems) {
            if (item.name !== name) {
                continue;
            }
            for (const it of item.items) {
                it.selected = false;
            }
        }
        this.tapRefresh();
    }

    public tapClearFilter() {
        this.queries = {
            keywords: '',
            page: 1,
            per_page: 20,
            category: 0,
            user: 0,
            tag: '',
            price: '',
            sort: '',
            order: '',
        };
        for (const item of this.filterItems) {
            for (const it of item.items) {
                it.selected = false;
            }
        }
        this.tapRefresh();
    }

    public tapSort(sort: string) {
        const oldSort = this.queries.sort;
        const oldOrder = this.queries.order;
        this.queries.order = 'desc';
        this.queries.sort = sort;
        if (sort != 'price') {
            this.tapRefresh();
            return;
        }
        if (oldSort == sort) {
            this.queries.order = oldOrder == 'asc' ? 'desc' : 'asc';
        } else {
            this.queries.order = 'desc';
        }
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
    * goPage
    */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.appList({...queries, filter: this.filterItems.length < 1}).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
                if (res.filter) {
                    this.filterItems = res.filter;
                }
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

}
