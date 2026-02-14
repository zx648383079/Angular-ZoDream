import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IUser } from '../../../../../theme/models/user';
import { emptyValidate, mobileValidate } from '../../../../../theme/validators';
import { IAddress, ICartItem, ICoupon, IGoods, IGoodsResult, IOrder, IPayment, IShipping } from '../../../model';
import { OrderService } from '../order.service';
import { SearchDialogComponent } from '../../../components';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-order-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
    private readonly service = inject(OrderService);
    private readonly toastrService = inject(DialogService);


    private readonly modal = viewChild(SearchDialogComponent);
    public readonly dataForm = form(signal<{
        user: IUser,
        address: IAddress
    }>({
        user: null,
        address: null
    }));
    public readonly stepIndex = signal(0);
    public goodsItems: ICartItem[] = [];
    public coupon?: ICoupon;
    public paymentItems: IPayment[] = [];
    public payment: IPayment;
    public shippingItems: IShipping[] = [];
    public shipping: IShipping;
    public order: IOrder;

    public readonly invalid = computed(() => {
        if (this.stepIndex() < 1) {
            return !this.dataForm.user().value();
        }
        if (this.stepIndex() == 1) {
            const address = this.dataForm.address().value();
            if (!address) {
                return true;
            }
            if (address.id > 0) {
                return false;
            }
            return emptyValidate(address.name) || address.region_id < 1 || emptyValidate(address.address) || !mobileValidate(address.tel);
        }
        if (this.stepIndex() == 2) {
            return this.goodsItems.length < 1;
        }
        if (this.stepIndex() == 4) {
            return !this.payment || !this.shipping;
        }
        return false;
    });

    public readonly userId = computed(() => this.dataForm.user().value()?.id);

    public tapNext() {
        if (this.invalid) {
            return;
        }
        this.stepIndex.update(v => v + 1);
        if (this.stepIndex() == 4) {
            this.loadShipping();
        }
    }

    public tapPrevious() {
        if (this.stepIndex() > 0) {
            this.stepIndex.update(v => v - 1);
        }
    }

    public tapAddGoods() {
        this.modal().open(items => {
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

    public onAmountChange() {
        this.refreshPrice();
    }

    private loadShipping() {
        const data = this.dataForm().value();
        if (!data.address || this.goodsItems.length < 1) {
            return;
        }
        this.service.shippingList(data.user.id, this.goodsItems, data.address.id > 0 ? data.address.id : data.address).subscribe({
            next: res => {
                if (res.data && res.data.length > 0) {
                    this.shippingItems = res.data;
                    return;
                }
                this.toastrService.warning('当前地址不支持配送');
            }, error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    public paymentChanged(item: IPayment) {
        this.payment = item;
        this.refreshPrice();
    }

    public shippingChanged(item: IShipping) {
        this.shipping = item;
        this.refreshPrice();
        this.service.paymentList(this.userId(), this.goodsItems, item.code).subscribe(res => {
            this.paymentItems = res.data;
        });
    }

    public tapCheckout(e?: ButtonEvent) {
        const data = this.dataForm().value();
        if (!data.address) {
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
            address: data.address.id > 0 ? data.address.id : data.address,
            shipping: this.shipping.code,
            payment: this.payment.code,
            coupon: this.coupon ? this.coupon.id : 0,
            user: data.user.id,
        }).subscribe({
            next: res => {
                e?.reset();
                // 清空结算，同时需要修改购物车的商品
                this.stepIndex.update(v => v + 1);
                this.order = undefined;
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    private refreshPrice() {
        const data = this.dataForm().value();
        if (!data.address || this.goodsItems.length < 1) {
            return;
        }
        this.service.previewOrder({
            goods: this.goodsItems,
            address: data.address.id > 0 ? data.address.id : data.address,
            shipping: this.shipping?.code,
            payment: this.payment?.code,
            coupon: this.coupon ? this.coupon.id : 0,
            user: data.user.id,
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
