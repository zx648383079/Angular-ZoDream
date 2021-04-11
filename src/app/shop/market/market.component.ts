import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ISite } from '../../theme/models/seo';
import { IArticle, ICart, ICartItem } from '../../theme/models/shop';
import { IUser } from '../../theme/models/user';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';
import { AuthService } from '../../theme/services';
import { setCart, setSite } from '../shop.actions';
import { ShopAppState } from '../shop.reducer';
import { selectShopCart, selectSite } from '../shop.selectors';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {

    public noticeItems: IArticle[] = [];

    public user: IUser;

    public site: ISite = {} as any;

    public categories = [];

    public tipItems: string[] =  [];
    public hotItems: string[] = [];

    public keywords = '';

    public cart: ICart;
    public cartOpen = false;

    constructor(
        private service: ShopService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: ToastrService,
        private store: Store<ShopAppState>,
        private authService: AuthService,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user;
        });
        this.store.select(selectSite).subscribe(site => {
            this.site = site;
        });
        this.store.select(selectShopCart).subscribe(cart => {
            this.cart = cart;
        });
    }

    ngOnInit(): void {
        this.service.batch({
            cart: {},
            category: {},
            hot_keywords: {},
            notice: {},
        }).subscribe(res => {
            this.store.dispatch(setCart({cart: res.cart}));
            this.categories = res.category;
            this.hotItems = res.hot_keywords;
            this.noticeItems = res.notice;
        });
    }

    public onKeywordsChange() {
        if (this.keywords.trim().length < 1) {
            this.tipItems = [];
            return;
        }
        this.service.searchTips(this.keywords).subscribe(res => {
            this.tipItems = res.data;
        });
    }

    public onSearchKeyDown(event: KeyboardEvent) {
        if (event.code !== 'Enter') {
            return;
        }
        this.tapSearch();
    }

    public tapSearch(keywords: string = this.keywords) {
        if (keywords.trim().length < 1) {
            this.toastrService.warning('请输入内容');
            return;
        }
        this.keywords = keywords;
        this.tipItems = [];
        this.router.navigate(['./search'], {
            queryParams: {
                keywords
            },
            relativeTo: this.route
        });
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
        this.router.navigate(['cart'], {relativeTo: this.route});
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

    public tapLogout() {
        this.authService.logout().subscribe(() => {
        });
    }

}
