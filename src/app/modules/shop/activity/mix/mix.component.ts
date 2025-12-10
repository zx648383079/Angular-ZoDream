import { Component, OnInit, inject } from '@angular/core';
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
export class MixComponent implements OnInit {
    private themeService = inject(ThemeService);
    private route = inject(ActivatedRoute);
    private service = inject(ActivityService);
    private searchService = inject(SearchService);


    public items: IActivity<IMixConfigure>[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
    };

    constructor() {
        this.themeService.titleChanged.next('超值礼包');
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
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
        this.service.mixList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.searchService.applyHistory(this.queries = queries);
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
