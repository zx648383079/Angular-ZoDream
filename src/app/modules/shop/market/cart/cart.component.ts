import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../../components/dialog';
import { ICart, ICartGroup, ICartItem, IGoods } from '../../model';
import { selectAuthStatus } from '../../../../theme/reducers/auth.selectors';
import { ThemeService } from '../../../../theme/services';
import { setCart, setCheckoutCart } from '../../shop.actions';
import { ShopAppState } from '../../shop.reducer';
import { selectShopCart } from '../../shop.selectors';
import { ShopService } from '../../shop.service';

@Component({
    standalone: false,
    selector: 'app-shop-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly service = inject(ShopService);
    private readonly toastrService = inject(DialogService);
    private readonly store = inject<Store<ShopAppState>>(Store);
    private readonly themeService = inject(ThemeService);


    public readonly items = signal<ICartGroup[]>([]);
    public cart: ICart;
    public readonly isChecked = signal(false);

    public likeItems: IGoods[] = [];
    public guest = true;

    constructor() {
        this.themeService.titleChanged.next('购物车');
        this.store.select(selectAuthStatus).subscribe(res => {
            this.guest = res.guest;
        });
        this.store.select(selectShopCart).subscribe(cart => {
            if (!cart) {
                return;
            }
            this.items.set(cart.data.map(g => {
                return {
                    ...g,
                    goods_list: g.goods_list.map(i => {
                        return {
                            ...i,
                            is_checked: false,
                        };
                    }),
                    checked: false,
                };
            }));
            this.cart = cart;
        });
    }

    ngOnInit() {
    }

    public readonly total = computed(() => {
        let total = 0;
        if (this.items().length < 1) {
            return total;
        }
        for (const item of this.items()) {
            for (const cart of item.goods_list) {
                if (cart.is_checked && cart.price) {
                    total += cart.amount * cart.price;
                }
            }
        }
        return total;
    });

    public readonly checkedCount = computed(() => {
        let total = 0;
        if (this.items().length < 1) {
            return total;
        }
        for (const item of this.items()) {
            for (const cart of item.goods_list) {
                if (cart.is_checked) {
                    total ++;
                }
            }
        }
        return total;
    });

    public toggleCheckAll() {
        this.isChecked.update(v => !v);
        const isChecked = this.isChecked();
        this.items.update(v => {
            return v.map(i => {
                i.checked = isChecked;
                for (const cart of i.goods_list) {
                    cart.is_checked = isChecked;
                }
                return i;
            })
        });
    }

    public toggleCheckGroup(item: ICartGroup) {
        item.checked = !item.checked;
        for (const cart of item.goods_list) {
            cart.is_checked = item.checked;
        }
        if (!item.checked) {
            this.isChecked.set(false);
        }
    }

    public toggleCheck(item: ICartGroup, cart: ICartItem) {
        cart.is_checked = !cart.is_checked;
        if (!cart.is_checked) {
            this.isChecked.set(false);
            item.checked = false;
        }
    }

    public tapCashier() {
        const data: ICartGroup[] = [];
        for (const item of this.items()) {
            const items: ICartItem[] = [];
            for (const cart of item.goods_list) {
                if (cart.is_checked) {
                    items.push(cart);
                }
            }
            if (items.length > 0) {
                data.push({
                    ...item,
                    goods_list: items,
                });
            }
        }
        if (data.length < 1) {
            this.toastrService.warning('请选择结算的商品');
            return;
        }
        this.store.dispatch(setCheckoutCart({items: data}));
        this.router.navigate(['../cashier'], {relativeTo: this.route});
    }

    public loadLike() {
        this.service.cartRecommendList().subscribe(res => {
            this.likeItems = res.data;
        });
    }

    public tapCollect(item: ICartItem) {

    }

    public onAmountChange(item: ICartItem) {
        this.service.cartUpdateItem(item.id, item.amount).subscribe({
            next: cart => {
                this.store.dispatch(setCart({cart}));
            },
            error: err => {
                this.toastrService.error(err);
            }
        })
    }

    public tapRemove(item: ICartItem) {
        this.service.cartDeleteItem(item.id).subscribe(cart => {
            this.store.dispatch(setCart({cart}));
        });
    }

    public tapRemoveChecked() {
        const items = [];
        for (const group of this.items()) {
            for (const item of group.goods_list) {
                if (item.is_checked) {
                    items.push(item.id);
                }
            }
        }
        if (items.length < 1) {
            this.toastrService.warning('请选择要删除的商品');
            return;
        }
        this.service.cartDeleteItem(items).subscribe(cart => {
            this.store.dispatch(setCart({cart}));
        });
    }

    public tapClearInvalid() {
        this.service.cartDeleteInvalid().subscribe(cart => {
            this.store.dispatch(setCart({cart}));
        });
    }
}
