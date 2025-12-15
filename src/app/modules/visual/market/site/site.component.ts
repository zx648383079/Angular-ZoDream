import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
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
export class SiteComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(VisualService);
    private readonly searchService = inject(SearchService);


    public items: ISite[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
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
    public sortKey = '';
    public orderAsc = true;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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
        this.goPage(this.queries.page().value() + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.searchSite({...queries}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.total = res.paging.total;
                this.items = res.data;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
