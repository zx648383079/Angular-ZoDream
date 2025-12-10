import { Component, OnInit, inject } from '@angular/core';
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
    private route = inject(ActivatedRoute);
    private service = inject(VisualService);
    private searchService = inject(SearchService);


    public items: ISite[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
    };
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
        this.service.searchSite({...queries}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.total = res.paging.total;
                this.items = res.data;
                this.searchService.applyHistory(this.queries = queries);
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
