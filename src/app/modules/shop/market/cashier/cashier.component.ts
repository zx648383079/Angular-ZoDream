import { Component, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IErrorResponse } from '../../../../theme/models/page';
import { IAddress, ICartGroup, ICartItem, ICoupon, IInvoiceTitle, IOrder, IPayment, IShipping } from '../../model';
import { IUser } from '../../../../theme/models/user';
import { selectAuthUser } from '../../../../theme/reducers/auth.selectors';
import { ThemeService } from '../../../../theme/services';
import { setCart, setCheckoutCart } from '../../shop.actions';
import { ShopAppState } from '../../shop.reducer';
import { selectShopCheckout } from '../../shop.selectors';
import { ShopService } from '../../shop.service';
import { InvoiceDialogComponent } from './invoice/invoice-dialog.component';
import { form, required } from '@angular/forms/signals';

interface ICartData {
    type: number;
    goods: ICartItem[] | number[];
}

@Component({
    standalone: false,
    selector: 'app-cashier',
    templateUrl: './cashier.component.html',
    styleUrls: ['./cashier.component.scss'],
})
export class CashierComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly service = inject(ShopService);
    private readonly toastrService = inject(DialogService);
    private readonly store = inject<Store<ShopAppState>>(Store);
    private readonly themeService = inject(ThemeService);


    private readonly invoiceModal = viewChild(InvoiceDialogComponent);

    public readonly user = signal<IUser>(null);
    public readonly address = signal<IAddress>(null);
    public readonly addressItems = signal<IAddress[]>([]);
    public readonly items = signal<ICartGroup[]>([]);
    public readonly order = signal<IOrder>(null);
    public readonly paymentItems = signal<IPayment[]>([]);
    public readonly payment = signal<IPayment>(null);
    public readonly shippingItems = signal<IShipping[]>([]);
    public readonly shipping = signal<IShipping>(null);
    public readonly couponItems = signal<ICoupon[]>([]);
    private couponLoaded = false;
    public readonly couponIndex = signal(0);
    public readonly invoice = signal<IInvoiceTitle>(null);
    public readonly invoiceItems = signal<IInvoiceTitle[]>([]);
    public readonly coupon = signal<ICoupon>(null);
    public readonly couponForm = form(signal({
        code: ''
    }), schemaPath => {
        required(schemaPath.code);
    });
    public readonly addressIsEdit = signal(true);
    public readonly editForm = form(signal<IAddress>({
        id: 0,
        name: '',
        tel: '',
        region_id: 0,
        address: ''
    }));
    private cartData: ICartData;
    public readonly dialogOpen = signal(0);
    public readonly dialogSelected = signal<any>(null);

    constructor() {
        this.themeService.titleChanged.next('结算');
        this.store.select(selectShopCheckout).subscribe(res => {
            if (!res || res.length < 1) {
                // 判断是否是结算时清空的
                if (this.items.length < 1) {
                    history.back();
                }
                return;
            }
            this.items.set(res);
            this.cartData = this.getGoodsIds(res);
            this.load();
        });
        this.tapEditAddress();
    }
    public toggleDefault() {
        this.editForm.is_default().value.update(v => !v);
    }

    private load() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user.set(user);
        });
        this.service.addressList({}).subscribe(res => {
            this.addressItems.set(res.data);
            if (res.data.length < 1) {
                return;
            }
            this.address.set(res.data[0]);
            this.addressIsEdit.set(false);
            this.onAddressChanged();
        });
    }

    public onAddressChanged() {
        this.refreshPrice();
        if (!this.address || !this.cartData) {
            return;
        }
        this.service.shippingList(this.cartData.goods, this.address().id, this.cartData.type).subscribe({
            next: res => {
                if (res.data && res.data.length > 0) {
                    this.shippingItems.set(res.data);
                    return;
                }
                this.toastrService.warning('当前地址不支持配送');
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }

    public tapEditInvoice() {
        this.dialogOpen.set(0);
        this.invoiceModal().open(this.invoice(), data => {
            this.invoice.set(data);
        });
    }

    public couponChanged(item: ICoupon) {
        this.coupon.set({...item});
        this.refreshPrice();
    }

    public paymentChanged(item: IPayment) {
        this.payment.set(item);
        this.refreshPrice();
    }

    public shippingChanged(item: IShipping) {
        this.shipping.set(item);
        this.refreshPrice();
        this.service.paymentList(this.cartData.goods, item.code, this.cartData.type).subscribe(res => {
            this.paymentItems.set(res.data);
        });
        if (this.couponLoaded) {
            return;
        }
        this.loadCoupon();
    }

    private loadCoupon() {
        this.couponLoaded = true;
        this.service.orderCouponList(this.cartData.goods, this.cartData.type).subscribe(res => {
            this.couponItems.set(res.data);
        });
    }

    public tapExchange() {
        if (this.couponForm().invalid()) {
            this.toastrService.warning('请输入优惠码');
            return;
        }
        this.service.couponExchange(this.couponForm.code().value()).subscribe({
            next: _ => {
                this.toastrService.success('兑换成功');
                this.loadCoupon();
                this.couponForm.code().value.set('');
                this.couponIndex.set(0);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public refreshPrice() {
        if (!this.address() || !this.cartData) {
            return;
        }
        this.service.previewOrder({
            goods: this.cartData.goods,
            address: this.address().id,
            shipping: this.shipping()?.code ?? '',
            payment: this.payment()?.code ?? '',
            type: this.cartData.type,
            coupon: this.coupon()?.id ?? 0,
            invoice: this.invoice() || 0
        }).subscribe({
            next: res => {
                this.order.set(res);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapCheckout(e?: ButtonEvent) {
        if (!this.address()) {
            this.toastrService.warning('请选择收货地址');
            return;
        }
        if (!this.cartData) {
            this.toastrService.warning('请选择结算商品');
            return;
        }
        if (!this.shipping()) {
            this.toastrService.warning('请选择配送方式');
            return;
        }
        if (!this.payment()) {
            this.toastrService.warning('请选择支付方式');
            return;
        }
        e?.enter();
        this.service.checkoutOrder({
            goods: this.cartData.goods,
            address: this.address().id,
            shipping: this.shipping().code,
            payment: this.payment().code,
            type: this.cartData.type,
            coupon: this.coupon()?.id ?? 0,
            invoice: this.invoice() || 0
        }).subscribe({
            next: res => {
                e?.reset();
                // 清空结算，同时需要修改购物车的商品
                this.updateStore();
                this.router.navigate(['pay', res.id], {relativeTo: this.route});
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapEditAddress(item?: IAddress) {
        this.addressIsEdit.set(true);
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.tel = item?.tel ?? '';
            v.region_id = item?.region_id ?? 0;
            v.address = item?.address ?? '';
            return v;
        });
    }

    public tapEditSave() {
        const data = Object.assign({}, this.editForm);
        if (!data.name || data.name.length < 1) {
            this.toastrService.warning('请输入收货人姓名');
            return;
        }
        this.service.addressSave(data).subscribe({
            next: res => {
                this.addressIsEdit.set(false);
                this.address.set(res);
                this.addressItems.update(v => {
                    return v.map(i => {
                        return i.id === res.id ? res : i;
                    });
                });
                this.onAddressChanged();
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }

    public tapEditCancel() {
        this.addressIsEdit.set(false);
    }

    public tapChooseAddress() {
        this.dialogSelected.set(this.address());
        this.dialogOpen.set(1);
    }

    public tapDialogYes() {
        this.address.set(this.dialogSelected());
        this.dialogOpen.set(0);
        this.onAddressChanged();
    }

    public tapDialogSelect(item: any) {
        this.dialogSelected.set(item);
    }

    private getGoodsIds(carts: ICartGroup[]): ICartData {
        if (!carts || carts.length < 1) {
            return {type: 0, goods: []};
        }
        const goods: ICartItem[] = [];
        const cart: number[]  = [];
        let type = -1;
        for (const group of carts) {
            for (const item of group.goods_list) {
                if (type === -1) {
                    type = item.id && item.id > 0 ? 0 : 1;
                }
                if (type > 0) {
                    goods.push({
                        goods_id: item.goods_id,
                        amount: item.amount,
                    });
                    continue;
                }
                cart.push(item.id as number);
            }
        }
        return type > 0 ? {type, goods} : {type, goods: cart};
    }

    private updateStore() {
        const cartItems = [];
        for (const group of this.items()) {
            for (const item of group.goods_list) {
                if (item.id > 0) {
                    cartItems.push(item.id);
                }
            }
        }
        this.store.dispatch(setCheckoutCart({
            items: []
        }));
        if (cartItems.length < 0) {
            return;
        }
        this.service.cart().subscribe(cart => {
            this.store.dispatch(setCart({cart}));
        });
    }

}
