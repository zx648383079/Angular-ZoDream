import { Component, OnInit } from '@angular/core';
import { IPageQueries } from '../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../theme/services';
import { TrackerService } from './tracker.service';
import { ILastestLog } from './model';
import { SuggestChangeEvent } from '../../components/form';

@Component({
    selector: 'app-trade-tracker',
    templateUrl: './trade-tracker.component.html',
    styleUrls: ['./trade-tracker.component.scss']
})
export class TradeTrackerComponent implements OnInit {
    public items: ILastestLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        product: '',
        channel: 0,
        project: 0,
        page: 1,
        per_page: 20,
    };

    constructor(
        private service: TrackerService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.queries = this.searchService.getQueries(res, this.queries);
            this.tapPage();
        });
    }

    public toggleOpen(item: ILastestLog) {
        item.open = !item.open;
        if (!item.open || item.price_loaded) {
            return;
        }
        item.price_loaded = true;
        item.price_items = [];
        this.service.productPrice(item.product_id).subscribe(res => {
            item.price_items = res.data ?? [];
        });
    }

    public tapSearch(keywords: any) {
        this.queries.keywords = keywords;
        this.tapRefresh();
    }

    public onSuggestChange(e: SuggestChangeEvent) {
        this.service.productSuggestion({
            keywords: e.text
        }).subscribe(res => {
            e.suggest(res.data ?? []);
        });
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

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.logList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    // public tapSearch(form: any) {
    //     this.queries = this.searchService.getQueries(form, this.queries);
    //     this.tapRefresh();
    // }

}
