import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../dialog';
import { DialogAnimation } from '../../../theme/constants/dialog-animation';
import { IErrorResponse } from '../../../theme/models/page';
import { IAddress, ICartGroup, ICartItem, ICoupon, IInvoiceTitle, IOrder, IPayment, IShipping } from '../../../theme/models/shop';
import { setCheckoutCart } from '../../shop.actions';
import { ShopAppState } from '../../shop.reducer';
import { selectShopCheckout } from '../../shop.selectors';
import { ShopService } from '../../shop.service';

interface ICartData {
    type: number;
    goods: ICartItem[] | number[];
}

@Component({
    selector: 'app-cashier',
    templateUrl: './cashier.component.html',
    styleUrls: ['./cashier.component.scss'],
    animations: [
        DialogAnimation,
    ]
})
export class CashierComponent implements OnInit {

    public address: IAddress;
    public addressItems: IAddress[] = [];
    public items: ICartGroup[] = [];
    public order: IOrder;
    public paymentItems: IPayment[] = [];
    public payment: IPayment;
    public shippingItems: IShipping[] = [];
    public couponItems: ICoupon[] = [];
    public shipping: IShipping;
    public invoice: IInvoiceTitle;
    public invoiceItems: IInvoiceTitle[] = [];
    public coupon: ICoupon;
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
    ) {
        this.store.select(selectShopCheckout).subscribe(res => {
            this.items = res;
            this.cartData = this.getGoodsIds(res);
        });
        this.tapEditAddress();
    }

    ngOnInit() {
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

    public paymentChanged(item: IPayment) {
        this.payment = item;
        this.refreshPrice();
    }

    public shippingChanged(item: IShipping) {
        this.shipping = item;
        this.refreshPrice();
    }

    public refreshPrice() {
        if (!this.address || !this.cartData) {
            return;
        }
        this.service.previewOrder(
            this.cartData.goods,
            this.address.id,
            this.shipping ? this.shipping.id : 0,
            this.payment ? this.payment.id : 0,
            this.cartData.type).subscribe(res => {
            this.order = res;
        });
    }

    public tapCheckout() {
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
        this.service.checkoutOrder(
            this.cartData.goods,
            this.address.id,
            this.shipping.id,
            this.payment.id,
            this.cartData.type).subscribe(res => {
            this.store.dispatch(setCheckoutCart({items: []}));
            this.router.navigate(['pay', res.id]);
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

}
