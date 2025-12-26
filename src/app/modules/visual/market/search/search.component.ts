import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { IFilter, IPageQueries } from '../../../../theme/models/page';
import { ISortItem } from '../../../../theme/models/seo';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../theme/services';
import { VisualService } from '../visual.service';
import { IThemeComponent } from '../../model';

@Component({
    standalone: false,
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(VisualService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IThemeComponent[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        category: 0,
        keywords: '',
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

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
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
        this.service.search({...queries, filter: this.filterItems.length < 1}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.total.set(res.paging.total);
                this.items.set(res.data);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                if (res.filter) {
                    this.filterItems.set(res.filter);
                }
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
