import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IUser } from '../../../../../theme/models/user';
import { emptyValidate } from '../../../../../theme/validators';
import { IAddress, ICartItem, ICoupon, IGoods, IGoodsResult, IOrder, IPayment, IShipping } from '../../../model';
import { SearchDialogComponent } from '../../goods/search-dialog/search-dialog.component';
import { OrderService } from '../order.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {

    @ViewChild(SearchDialogComponent)
    private modal: SearchDialogComponent;
    public stepIndex = 0;
    public user: IUser;
    public address: IAddress;
    public goodsItems: ICartItem[] = [];
    public coupon?: ICoupon;
    public paymentItems: IPayment[] = [];
    public payment: IPayment;
    public shippingItems: IShipping[] = [];
    public shipping: IShipping;
    public order: IOrder;

    constructor(
        private service: OrderService,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
    }

    public get invalid(): boolean {
        if (this.stepIndex < 1) {
            return !this.user;
        }
        if (this.stepIndex == 1) {
            return !this.address || emptyValidate(this.address.name) || this.address.region_id < 1;
        }
        if (this.stepIndex == 2) {
            return this.goodsItems.length < 1;
        }
        if (this.stepIndex == 4) {
            return !this.payment || !this.shipping;
        }
        return false;
    }

    public tapNext() {
        if (this.invalid) {
            return;
        }
        this.stepIndex ++;
    }

    public tapPrevious() {
        if (this.stepIndex > 0) {
            this.stepIndex -- ;
        }
    }

    public tapAddGoods() {
        this.modal.open(items => {
            for (const item of items as IGoodsResult[]) {
                if (this.indexOfGoods(item.id, item.product_id) >= 0) {
                    continue;
                }
                this.goodsItems.push({
                    amount: 1,
                    price: item.price,
                    goods_id: item.id,
                    product_id: item.product_id,
                    attribute_id: item.attribute_id,
                    attribute_value: item.attribute_value,
                    goods: item as IGoods,
                });
            }
            this.refreshPrice();
        });
    }

    public tapRemoveGoods(i: number) {
        this.goodsItems.splice(i, 1);
        this.refreshPrice();
    }

    public paymentChanged(item: IPayment) {
        this.payment = item;
        this.refreshPrice();
    }

    public shippingChanged(item: IShipping) {
        this.shipping = item;
        this.refreshPrice();
        this.service.paymentList(this.user.id, this.goodsItems, item.id).subscribe(res => {
            this.paymentItems = res.data;
        });
    }

    public tapCheckout(e?: ButtonEvent) {
        if (!this.address) {
            this.toastrService.warning('请选择收货地址');
            return;
        }
        if (this.goodsItems.length < 1) {
            this.toastrService.warning('请选择结算商品');
            return;
        }
        if (!this.shipping) {
            this.toastrService.warning('请选择配送方式');
            return;
        }
        if (!this.payment) {
            this.toastrService.warning('请选择支付方式');
            return;
        }
        e?.enter();
        this.service.checkoutOrder({
            goods: this.goodsItems,
            address: this.address.id,
            shipping: this.shipping.id,
            payment: this.payment.id,
            coupon: this.coupon ? this.coupon.id : 0,
            user: this.user.id,
        }).subscribe({
            next: res => {
                e?.reset();
                // 清空结算，同时需要修改购物车的商品
                this.stepIndex ++;
                this.order = undefined;
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    private refreshPrice() {
        if (!this.address || this.goodsItems.length < 1) {
            return;
        }
        this.service.previewOrder({
            goods: this.goodsItems,
            address: this.address.id,
            shipping: this.shipping?.id,
            payment: this.payment?.id,
            coupon: this.coupon ? this.coupon.id : 0,
            user: this.user.id,
        }).subscribe({
            next: res => {
                this.order = res;
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    private indexOfGoods(goods: number, product: number): number {
        for (let i = 0; i < this.goodsItems.length; i++) {
            const element = this.goodsItems[i];
            if (element.goods_id === goods && element.product_id === product) {
                return i;
            }
        }
        return -1;
    }
}
