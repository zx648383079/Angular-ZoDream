import { form } from '@angular/forms/signals';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { TrendService } from '../trend.service';
import { TimeTabItems } from '../model';

@Component({
    standalone: false,
    selector: 'app-trend-source',
    templateUrl: './source.component.html',
    styleUrls: ['./source.component.scss']
})
export class SourceComponent {
    private readonly service = inject(TrendService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<any[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        start_at: '',
        end_at: '',
        type: '',
        page: 1,
        per_page: 20
    }));
    public tabItems = TimeTabItems;
    public tabIndex = '';

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public readonly headerTitle = computed(() => {
        switch (this.queries.type().value()) {
            case 'engine':
                return '搜索引擎';
            case 'keywords':
                return '搜索词';
            case 'link':
                return '外部链接';
            default:
                return '来源类型';
        }
    });

    public getHeaderValue(item: any) {
         switch (this.queries.type().value()) {
            case 'engine':

            case 'keywords':
                return item.words;
            case 'link':
                return item.host;
            default:
                return item.host;
        }
    }

    public tapTab(val: string) {
        this.tabIndex = val;
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
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries: any = {...this.queries().value(), page};
        if (this.tabIndex != '') {
            queries.start_at = this.tabIndex;
            queries.end_at = '';
        }
        this.service.sourceList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                if (res.paging) {
                    this.hasMore = res.paging.more;
                    this.total.set(res.paging.total);
                }
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tabIndex = '';
        this.tapRefresh();
    }

}
