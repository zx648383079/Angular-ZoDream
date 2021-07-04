import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ICart, ICartItem } from '../../../theme/models/shop';
import { hasElementByClass } from '../../../theme/utils';
import { setCart } from '../../shop.actions';
import { ShopAppState } from '../../shop.reducer';
import { selectShopCart } from '../../shop.selectors';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.scss']
})
export class CartDialogComponent {

    public cart: ICart;
    public cartOpen = false;

    constructor(
        private store: Store<ShopAppState>,
        private service: ShopService,
        private router: Router,
    ) {
        this.store.select(selectShopCart).subscribe(cart => {
            this.cart = cart;
        });
    }

    @HostListener('document:click', ['$event']) hideCalendar(event: any) {
        if (!event.target.closest('.cart-button') && !hasElementByClass(event.path, 'cart-button')) {
            this.cartOpen = false;
        }
    }

    ngOnInit() {
    }

    public tapCart() {
        if (this.cart && this.cart.data.length > 0) {
            this.cartOpen = !this.cartOpen;
            return;
        }
        this.tapViewCart();
    }

    /**
     * tapViewCart
     */
    public tapViewCart() {
        this.cartOpen = false;
        this.router.navigate(['/shop/market/cart']);
    }

    /**
     * tapRemoveCart
     */
    public tapRemoveCart(item: ICartItem) {
        this.service.cartDeleteItem(item.id).subscribe(cart => {
            this.store.dispatch(setCart({cart}));
            if (cart.data.length < 1) {
                this.cartOpen = false;
            }
        });
    }

}
