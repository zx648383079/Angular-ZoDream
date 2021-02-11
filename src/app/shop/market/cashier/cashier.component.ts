import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { IAddress, ICartGroup, ICoupon, IInvoiceTitle, IOrder, IPayment, IShipping } from '../../../theme/models/shop';
import { ShopAppState } from '../../shop.reducer';
import { selectShopCheckout } from '../../shop.selectors';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: ShopService,
        private toastrService: ToastrService,
        private store: Store<ShopAppState>,
    ) {
        this.store.select(selectShopCheckout).subscribe(res => {
            this.items = res;
        });
        this.tapEditAddress();
    }

    ngOnInit() {
    }

    public tapEditAddress(item?: IAddress) {
        this.addressIsEdit = true;
        this.editData = item ? Object.assign({}, item) : {} as  any;
    }

    public tapChooseAddress() {

    }

}
