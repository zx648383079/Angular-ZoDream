import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ICart, ICartGroup, ICartItem, IGoods } from '../../../theme/models/shop';
import { getAuthStatus } from '../../../theme/reducers/auth.selectors';
import { setCheckoutCart } from '../../shop.actions';
import { ShopAppState } from '../../shop.reducer';
import { selectShopCart } from '../../shop.selectors';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

    public items: ICartGroup[] = [];
    public cart: ICart;
    public checkedAll = false;

    public likeItems: IGoods[] = [];
    public guest = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: ShopService,
        private toastrService: ToastrService,
        private store: Store<ShopAppState>,
    ) {
        this.store.select(getAuthStatus).subscribe(logined => {
            this.guest = !logined;
        });
        this.store.select(selectShopCart).subscribe(cart => {
            if (!cart) {
                return;
            }
            this.items = cart.data;
            this.cart = cart;
        });
    }

    ngOnInit() {
    }

    get total() {
        let total = 0;
        if (!this.items || this.items.length < 1) {
            return total;
        }
        for (const item of this.items) {
            for (const cart of item.goods_list) {
                if (cart.is_checked && cart.price) {
                    total += cart.amount * cart.price;
                }
            }
        }
        return total;
    }

    public toggleCheckAll() {
        this.checkedAll = !this.checkedAll;
        for (const item of this.items) {
            item.checked = this.checkedAll;
            for (const cart of item.goods_list) {
                cart.is_checked = this.checkedAll;
            }
        }
    }

    public toggleCheckGroup(item: ICartGroup) {
        item.checked = !item.checked;
        for (const cart of item.goods_list) {
            cart.is_checked = item.checked;
        }
        if (!item.checked) {
            this.checkedAll = false;
        }
    }

    public toggleCheck(item: ICartGroup, cart: ICartItem) {
        cart.is_checked = !cart.is_checked;
        if (!cart.is_checked) {
            this.checkedAll = false;
            item.checked = false;
        }
    }

    public tapCashier() {
        const data: ICartGroup[] = [];
        for (const item of this.items) {
            const items: ICartItem[] = [];
            for (const cart of item.goods_list) {
                if (cart.is_checked) {
                    items.push(cart);
                }
            }
            if (items.length > 0) {
                item.goods_list = items;
                data.push(item);
            }
        }
        if (data.length < 1) {
            this.toastrService.warning('请选择结算的商品');
            return;
        }
        this.store.dispatch(setCheckoutCart({items: data}));
        this.router.navigate(['./cashier'], {relativeTo: this.route});
    }

    public loadLike() {
        this.service.cartRecommendList().subscribe(res => {
            this.likeItems = res.data;
        });
    }

}
