import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';
import { ISortItem } from '../../../../theme/models/seo';
import { ActivatedRoute } from '@angular/router';
import { VisualService } from '../visual.service';
import { SearchService } from '../../../../theme/services';
import { ISite } from '../../model';

@Component({
    standalone: false,
    selector: 'app-site',
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.scss']
})
export class SiteComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(VisualService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ISite[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
    }));
    public sortItems: ISortItem[] = [
        {name: $localize `Default`, value: ''},
        {name: $localize `Price`, value: 'price', asc: true},
        {name: $localize `Sales`, value: 'sale', asc: false},
        {name: $localize `Evaluation`, value: 'comment', asc: false},
    ];
    public readonly sortKey = signal('');
    public readonly orderAsc = signal(true);

    constructor() {
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
        this.service.searchSite({...queries}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.total.set(res.paging.total);
                this.items.set(res.data);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
