import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { IPageQueries } from '../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../theme/services';
import { TrackerService } from './tracker.service';
import { ILastestLog } from './model';
import { SuggestChangeEvent } from '../../components/form';

@Component({
    standalone: false,
    selector: 'app-trade-tracker',
    templateUrl: './trade-tracker.component.html',
    styleUrls: ['./trade-tracker.component.scss']
})
export class TradeTrackerComponent implements OnInit {
    private readonly service = inject(TrackerService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: ILastestLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        product: '',
        channel: 0,
        project: 0,
        page: 1,
        per_page: 20,
    }));

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.searchService.getQueries(res, this.queries);
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
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.logList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    // public tapSearch() {
    //
    //     this.tapRefresh();
    // }

}
