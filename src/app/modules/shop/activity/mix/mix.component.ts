import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageQueries } from '../../../../theme/models/page';
import { IActivity, IMixConfigure } from '../../model';
import { SearchService } from '../../../../theme/services';
import { ThemeService } from '../../../../theme/services';
import { ActivityService } from '../activity.service';

@Component({
    standalone: false,
    selector: 'app-mix',
    templateUrl: './mix.component.html',
    styleUrls: ['./mix.component.scss']
})
export class MixComponent {
    private readonly themeService = inject(ThemeService);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(ActivityService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IActivity<IMixConfigure>[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
    }));

    constructor() {
        this.themeService.titleChanged.next('超值礼包');
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public formatAmount(item: IActivity<IMixConfigure>) {
        let total = 0;
        item.goods_items.forEach(i => {
            total += parseInt(i.amount as any);
        });
        return total;
    }

    public formatTotal(item: IActivity<IMixConfigure>) {
        let total = 0;
        item.goods_items.forEach(i => {
            total += i.amount * i.goods.price;
        });
        return total;
    }

    public formatDiscount(item: IActivity<IMixConfigure>) {
        return this.formatTotal(item) - item.configure.price;
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
        this.service.mixList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
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
