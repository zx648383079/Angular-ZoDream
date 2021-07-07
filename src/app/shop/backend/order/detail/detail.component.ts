import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../dialog';
import { IOrder, IOrderGoods } from '../../../../theme/models/shop';
import { OrderService } from '../order.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: IOrder;
    public items: IOrderGoods[] = [];
    public refundData = {
        refund_type: 0,
        money: 0,
    };
    public refundTypeItems = ['原路退回', '退到余额', '线下退款'];
    public shipData = {
        shipping_id: 0,
        logistics_number: '',
        goods: [],
    };
    public shippingItems = [];

    constructor(
        private service: OrderService,
        private router: Router,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.order(params.id).subscribe((res: any) => {
                this.data = res;
                this.items = res.goods || res.goods_list;
            });
        });
    }

    public get timeIndex() {
        if (!this.data || this.data.status < 10 || this.data.status > 80) {
            return 0;
        }
        if (this.data.status === 80) {
            return 5;
        }
        if (this.data.status >= 60) {
            return 4;
        }
        if (this.data.status >= 40) {
            return 3;
        }
        if (this.data.status >= 20) {
            return 2;
        }
        if (this.data.status >= 10) {
            return 1;
        }
        return 0;
    }

    public get timeBarStyle() {
        return {
            width: Math.min(100, this.timeIndex * 25) + '%'
        };
    }

    public tapRefund(modal: DialogEvent) {
        modal.open(() => {
            this.service.orderSave({
                id: this.data.id,
                operate: 'refund',
                ...this.refundData
            }).subscribe({
                next: res => {
                    this.toastrService.success('退款成功');
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapShip(modal: DialogEvent) {
        this.shipData.goods = this.items.map(i => {
            return {...i, ship_amount: 0};
        });
        if (this.shippingItems.length < 1) {
            this.service.shippingAll().subscribe(res => {
                this.shippingItems = res;
            });
        }
        modal.open(() => {
            this.service.orderSave({
                id: this.data.id,
                operate: 'shipping',
                shipping_id: this.shipData.shipping_id,
                logistics_number: this.shipData.logistics_number,
                goods: this.shipData.goods.map(i => {
                    return {
                        id: i.id,
                        amount: i.ship_amount
                    };
                }).filter(i => i.amount > 0)
            }).subscribe({
                next: res => {
                    this.toastrService.success('已确认发货');
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }
}
