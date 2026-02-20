import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { ShopService } from '../../shop.service';
import { IOrderRefund } from '../../model';

@Component({
    standalone: false,
    selector: 'app-price-protect',
    templateUrl: './price-protect.component.html',
    styleUrls: ['./price-protect.component.scss']
})
export class PriceProtectComponent {
    private readonly service = inject(ShopService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);

    public title = '价格保护';
    public readonly items = signal<IOrderRefund[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
    }));

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确认删除此“' + item.id + '”记录？', () => {
            // this.service.subscribeRemove(item.id).subscribe(res => {
            //     if (!res.data) {
            //         return;
            //     }
            //     this.toastrService.success($localize `Delete Successfully`);
            //     this.items = this.items.filter(it => {
            //         return it.id !== item.id;
            //     });
            // });
        });
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
        const queries = {... this.queries().value(), page};
        // this.service.orderList(queries).subscribe(res => {
        //     this.isLoading.set(false);
        //     this.items.set(res.data);
        //     this.hasMore = res.paging.more;
        //     this.total.set(res.paging.total);
        //     this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
        // });
    }

}
