import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { emptyValidate } from '../../../../../theme/validators';
import { IOrder, IOrderGoods } from '../../../model';
import { OrderService } from '../order.service';

@Component({
    standalone: false,
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    private readonly service = inject(OrderService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


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
    public remarkData = {
        remark: '',
    }

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

    public tapOperate(e: ButtonEvent, operate: string) {
        if (emptyValidate(this.remarkData.remark)) {
            this.toastrService.warning('请输入操作备注')
            return;
        }
        e?.enter();
        this.service.orderSave({
            id: this.data.id,
            operate,
            ...this.remarkData
        }).subscribe({
            next: res => {
                e.reset();
                this.toastrService.success('操作成功');
                this.data = Object.assign({}, this.data, res);
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        })
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
                    this.data = Object.assign({}, this.data, res);
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
                    this.data = Object.assign({}, this.data, res);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }
}
