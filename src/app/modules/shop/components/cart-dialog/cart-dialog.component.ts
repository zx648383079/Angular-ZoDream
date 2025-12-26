import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ICart, ICartItem } from '../../model';
import { hasElementByClass } from '../../../../theme/utils/doc';
import { setCart } from '../../shop.actions';
import { ShopAppState } from '../../shop.reducer';
import { selectShopCart } from '../../shop.selectors';
import { ShopService } from '../../shop.service';

@Component({
    standalone: false,
    selector: 'app-cart-dialog',
    templateUrl: './cart-dialog.component.html',
    styleUrls: ['./cart-dialog.component.scss']
})
export class CartDialogComponent {
    private readonly store = inject<Store<ShopAppState>>(Store);
    private readonly service = inject(ShopService);
    private readonly router = inject(Router);


    public readonly cart = signal<ICart>(null);
    public readonly cartOpen = signal(false);

    constructor() {
        this.store.select(selectShopCart).subscribe(cart => {
            this.cart.set(cart);
        });
    }

    @HostListener('document:click', ['$event']) hideCalendar(event: any) {
        if (!event.target.closest('.cart-button') && !hasElementByClass(event.path, 'cart-button')) {
            this.cartOpen.set(false);
        }
    }

    public tapCart() {
        if (this.cart() && this.cart().data.length > 0) {
            this.cartOpen.update(v => !v);
            return;
        }
        this.tapViewCart();
    }

    /**
     * tapViewCart
     */
    public tapViewCart() {
        this.cartOpen.set(false);
        this.router.navigate(['/shop/market/cart']);
    }

    /**
     * tapRemoveCart
     */
    public tapRemoveCart(item: ICartItem) {
        this.service.cartDeleteItem(item.id).subscribe(cart => {
            this.store.dispatch(setCart({cart}));
            if (cart.data.length < 1) {
                this.cartOpen.set(false);
            }
        });
    }

}
