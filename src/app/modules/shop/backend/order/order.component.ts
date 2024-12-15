import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { PanelAnimation } from '../../../../theme/constants/panel-animation';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { IOrder } from '../../model';
import { SearchService } from '../../../../theme/services';
import { OrderService } from './order.service';

@Component({
    standalone: false,
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

    public shipData = {
        fee: 0, 
    }

    constructor(
        private service: OrderService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private searchService: SearchService,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }


    public tapShip(modal: DialogEvent, item: IOrder) {
        this.shipData.fee = item.shipping_fee;
        modal.open(() => {
            this.service.orderSave({
                id: item.id,
                operate: 'fee',
                shipping_fee: this.shipData.fee
            }).subscribe({
                next: res => {
                    this.toastrService.success('修改成功');
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        });
    }
    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.title + '”订单？', () => {
            this.service.orderRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
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
        this.service.orderList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

}
