import { Component, OnInit, inject } from '@angular/core';
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
    private service = inject(ShopService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    public title = '我的优惠券';
    public items: ICoupon[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public tabIndex = 0;

    constructor() {
        this.tapRefresh();
    }

    ngOnInit() {}


    public tapTab(i: number) {
        this.tabIndex = i;
        this.tapRefresh();
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.couponMyList({
            status: this.tabIndex,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }
}
