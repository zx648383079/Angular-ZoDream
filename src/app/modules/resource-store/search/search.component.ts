import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IFilter, IFilterOptionItem } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';
import { IResource } from '../model';
import { ResourceService } from '../resource.service';

export interface IFilterTag {
    label: string,
    name: string,
}

@Component({
    standalone: false,
    selector: 'app-res-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    private readonly service = inject(ResourceService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly queries = signal({
        keywords: '',
        page: 1,
        per_page: 20,
        category: 0,
        user: 0,
        tag: '',
        price: '',
        sort: '',
        order: '',
    });
    public readonly queryForm = form(signal({
        keywords: '',
    }));
    public items: IResource[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public filterItems: IFilter[] = [];
    public viewTable = true;
    public filterOpen = true;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries.update(v => this.searchService.getQueries(params, v));
            this.queryForm.keywords().value.set(this.queries().keywords);
            this.tapPage(this.queries().page);
        });
    }

    public get selectedFilters() {
        const items: IFilterTag[] = [];
        if (!emptyValidate(this.queries().keywords)) {
            items.push({
                name: 'keywords',
                label: `${this.queries().keywords}`
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
        this.queries().price = `${item.min}-${item.max}`;
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
        this.queries().user = user;
        this.tapRefresh();
    }

    public tapCategory(cat: number) {
        this.queries().category = cat;
        this.tapRefresh();
    }

    public tapClearQuery() {
        this.queryForm.keywords().value.set('');
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
        this.queries.set({
            keywords: '',
            page: 1,
            per_page: 20,
            category: 0,
            user: 0,
            tag: '',
            price: '',
            sort: '',
            order: '',
        });
        for (const item of this.filterItems) {
            for (const it of item.items) {
                it.selected = false;
            }
        }
        this.tapRefresh();
    }

    public tapSort(sort: string) {
        const oldSort = this.queries().sort;
        const oldOrder = this.queries().order;
        this.queries.update(v => {
            v.order = 'desc';
            v.sort = sort;
            return v;
        });
        if (sort != 'price') {
            this.tapRefresh();
            return;
        }
        this.queries.update(v => {
            if (oldSort == sort) {
                v.order = oldOrder == 'asc' ? 'desc' : 'asc';
            } else {
                v.order = 'desc';
            }
            return v;
        });
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage(page: number) {
        this.goPage(page);
    }

    public tapMore() {
        this.goPage(this.queries().page + 1);
    }

    /**
    * goPage
    */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries(), page};
        this.service.resourceList({...queries, filter: this.filterItems.length < 1}).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries.set(queries);
                this.isLoading = false;
                if (res.filter) {
                    this.filterItems = res.filter;
                }
                this.filterOpen = this.filterOpen && this.filterItems.length > 0;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {
        this.queries.update(v => {
            v.keywords = this.queryForm.keywords().value();
            return v;
        });
        this.tapRefresh();
    }

}
