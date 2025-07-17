import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { DialogAnimation } from '../../../../theme/constants/dialog-animation';
import { IErrorResponse } from '../../../../theme/models/page';
import { IAddress, ICartGroup, ICartItem, ICoupon, IInvoiceTitle, IOrder, IPayment, IShipping } from '../../model';
import { IUser } from '../../../../theme/models/user';
import { selectAuthUser } from '../../../../theme/reducers/auth.selectors';
import { ThemeService } from '../../../../theme/services';
import { emptyValidate } from '../../../../theme/validators';
import { setCart, setCheckoutCart } from '../../shop.actions';
import { ShopAppState } from '../../shop.reducer';
import { selectShopCheckout } from '../../shop.selectors';
import { ShopService } from '../../shop.service';
import { InvoiceDialogComponent } from './invoice/invoice-dialog.component';

interface ICartData {
    type: number;
    goods: ICartItem[] | number[];
}

@Component({
    standalone: false,
    selector: 'app-cashier',
    templateUrl: './cashier.component.html',
    styleUrls: ['./cashier.component.scss'],
    animations: [
        DialogAnimation,
    ]
})
export class CashierComponent implements OnInit {

    @ViewChild(InvoiceDialogComponent)
    private invoiceModal: InvoiceDialogComponent;

    public user: IUser;
    public address: IAddress;
    public addressItems: IAddress[] = [];
    public items: ICartGroup[] = [];
    public order: IOrder;
    public paymentItems: IPayment[] = [];
    public payment: IPayment;
    public shippingItems: IShipping[] = [];
    public shipping: IShipping;
    public couponItems: ICoupon[] = [];
    private couponLoaded = false;
    public couponIndex = 0;
    public invoice: IInvoiceTitle;
    public invoiceItems: IInvoiceTitle[] = [];
    public coupon: ICoupon;
    public couponCode = '';
    public addressIsEdit = true;
    public editData: IAddress;
    private cartData: ICartData;
    public dialogOpen = 0;
    public dialogSelected;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: ShopService,
        private toastrService: DialogService,
        private store: Store<ShopAppState>,
        private themeService: ThemeService,
    ) {
        this.themeService.titleChanged.next('结算');
        this.store.select(selectShopCheckout).subscribe(res => {
            if (!res || res.length < 1) {
                // 判断是否是结算时清空的
                if (this.items.length < 1) {
                    history.back();
                }
                return;
            }
            this.items = res;
            this.cartData = this.getGoodsIds(res);
            this.load();
        });
        this.tapEditAddress();
    }

    ngOnInit() {
        
    }

    private load() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user;
        });
        this.service.addressList({}).subscribe(res => {
            this.addressItems = res.data;
            if (res.data.length < 1) {
                return;
            }
            this.address = res.data[0];
            this.addressIsEdit = false;
            this.onAddressChanged();
        });
    }

    public onAddressChanged() {
        this.refreshPrice();
        if (!this.address || !this.cartData) {
            return;
        }
        this.service.shippingList(this.cartData.goods, this.address.id, this.cartData.type).subscribe({
            next: res => {
                if (res.data && res.data.length > 0) {
                    this.shippingItems = res.data;
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
        this.dialogOpen = 0;
        this.invoiceModal.open(this.invoice, data => {
            this.invoice = data;
        });
    }

    public couponChanged(item: ICoupon) {
        this.coupon = {...item};
        this.refreshPrice();
    }

    public paymentChanged(item: IPayment) {
        this.payment = item;
        this.refreshPrice();
    }

    public shippingChanged(item: IShipping) {
        this.shipping = item;
        this.refreshPrice();
        this.service.paymentList(this.cartData.goods, item.code, this.cartData.type).subscribe(res => {
            this.paymentItems = res.data;
        });
        if (this.couponLoaded) {
            return;
        }
        this.loadCoupon();
    }

    private loadCoupon() {
        this.couponLoaded = true;
        this.service.orderCouponList(this.cartData.goods, this.cartData.type).subscribe(res => {
            this.couponItems = res.data;
        });
    }

    public tapExchange() {
        if (emptyValidate(this.couponCode)) {
            this.toastrService.warning('请输入优惠码');
            return;
        }
        this.service.couponExchange(this.couponCode).subscribe({
            next: _ => {
                this.toastrService.success('兑换成功');
                this.loadCoupon();
                this.couponCode = '';
                this.couponIndex = 0;
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public refreshPrice() {
        if (!this.address || !this.cartData) {
            return;
        }
        this.service.previewOrder({
            goods: this.cartData.goods,
            address: this.address.id,
            shipping: this.shipping ? this.shipping.code : '',
            payment: this.payment ? this.payment.code : '',
            type: this.cartData.type,
            coupon: this.coupon ? this.coupon.id : 0,
            invoice: this.invoice || 0
        }).subscribe({
            next: res => {
                this.order = res;
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapCheckout(e?: ButtonEvent) {
        if (!this.address) {
            this.toastrService.warning('请选择收货地址');
            return;
        }
        if (!this.cartData) {
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
            goods: this.cartData.goods,
            address: this.address.id,
            shipping: this.shipping.code,
            payment: this.payment.code,
            type: this.cartData.type,
            coupon: this.coupon ? this.coupon.id : 0,
            invoice: this.invoice || 0
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
        this.addressIsEdit = true;
        this.editData = item ? Object.assign({}, item) : {region_id: 0} as  any;
    }

    public tapEditSave() {
        const data = Object.assign({}, this.editData);
        if (!data.name || data.name.length < 1) {
            this.toastrService.warning('请输入收货人姓名');
            return;
        }
        this.service.addressSave(data).subscribe({
            next: res => {
                this.addressIsEdit = false;
                this.address = res;
                this.addressItems = this.addressItems.map(i => {
                    return i.id === res.id ? res : i;
                });
                this.onAddressChanged();
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }

    public tapEditCancel() {
        this.addressIsEdit = false;
    }

    public tapChooseAddress() {
        this.dialogSelected = this.address;
        this.dialogOpen = 1;
    }

    public tapDialogYes() {
        this.address = this.dialogSelected;
        this.dialogOpen = 0;
        this.onAddressChanged();
    }

    public tapDialogSelect(item: any) {
        this.dialogSelected = item;
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
        for (const group of this.items) {
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
