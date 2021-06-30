import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PanelAnimation } from '../../../theme/constants/panel-animation';
import { IPageQueries } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { IOrder } from '../../../theme/models/shop';
import { applyHistory, getQueries } from '../../../theme/query';
import { OrderService } from './order.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
    animations: [
        PanelAnimation,
    ]
})
export class OrderComponent implements OnInit {

    public items: IOrder[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        series_number: '',
        status: 0,
        page: 1,
        per_page: 20,
        keywords: '',
        user: '',
        start_at: '',
        end_at: '',
        conginee: '',
        tel: '',
        address: '',
    };
    public statusItems: IItem[] = [
        {name: '待支付', value: 10},
        {name: '支付中', value: 12},
        {name: '待收货', value: 40},
        {name: '已完成', value: 80},
        {name: '已取消', value: 1},
        {name: '已失效', value: 2},
        {name: '待发货', value: 20},
        {name: '待评价', value: 60},
        {name: '已退款', value: 81}
    ];
    public panelOpen = false;

    constructor(
        private service: OrderService,
        private route: ActivatedRoute,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapRefresh();
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.orderList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            applyHistory(this.queries = queries);
        });
    }

}
