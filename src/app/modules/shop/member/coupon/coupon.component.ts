import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICoupon } from '../../model';
import { ShopService } from '../../shop.service';

@Component({
    standalone: false,
    selector: 'app-coupon',
    templateUrl: './coupon.component.html',
    styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
    private readonly service = inject(ShopService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    public title = '我的优惠券';
    public readonly items = signal<ICoupon[]>([]);
    private hasMore = true;
    public readonly queries = signal({
        page: 1,
        per_page: 20
    });
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly tabIndex = signal(0);

    constructor() {
        this.tapRefresh();
    }

    ngOnInit() {}


    public tapTab(i: number) {
        this.tabIndex.set(i);
        this.tapRefresh();
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries().page);
    }

    public tapMore() {
        this.goPage(this.queries().page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.couponMyList({
            status: this.tabIndex,
            ...this.queries(),
            page,
        }).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries.update(v => {
                    v.page = page;
                    return {...v};
                });
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }
}
