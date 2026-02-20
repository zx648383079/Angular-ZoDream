import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IErrorResult, IPageQueries } from '../../../../theme/models/page';
import { ICoupon } from '../../model';
import { SearchService } from '../../../../theme/services';
import { ThemeService } from '../../../../theme/services';
import { ActivityService } from '../activity.service';

@Component({
    standalone: false,
    selector: 'app-coupon',
    templateUrl: './coupon.component.html',
    styleUrls: ['./coupon.component.scss']
})
export class CouponComponent {
    private readonly service = inject(ActivityService);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ICoupon[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
    }));

    constructor() {
        this.themeService.titleChanged.next('领券中心');
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapReceive(item: ICoupon) {
        this.service.couponReceive(item.id).subscribe(_ => {
            item.can_receive = false;
            this.toastrService.success('领取成功');
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
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

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.couponList(queries).subscribe({
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
