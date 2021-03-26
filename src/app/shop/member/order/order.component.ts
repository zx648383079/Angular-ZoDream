import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IItem } from '../../../theme/models/seo';
import { IOrder } from '../../../theme/models/shop';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

    public items: IOrder[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public tabItems: IItem[] = [
        {
            name: '全部订单',
            value: 0,
        },
        {
            name: '待付款',
            value: 10,
        },
        {
            name: '待发货',
            value: 20,
        },
        {
            name: '待收货',
            value: 40,
        },
        {
            name: '待评价',
            value: 60,
        },
    ];
    public tabSelected = 0;
    public keywords = '';

    constructor(
        private service: ShopService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {}


    public tapTab(item: IItem) {
        this.tabSelected = item.value as number;
        this.tapRefresh();
    }

    public tapDetail(item: IOrder) {
        this.router.navigate([item.id], {relativeTo: this.route});
    }

    public tapPay(item: IOrder) {
        this.router.navigate(['../../market/cashier/pay', item.id], {relativeTo: this.route});
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
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
        this.service.orderList({
            keywords: this.keywords,
            status: this.tabSelected,
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
