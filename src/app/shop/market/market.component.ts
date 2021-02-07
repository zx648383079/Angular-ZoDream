import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ISite } from '../../theme/models/seo';
import { IArticle, ICart } from '../../theme/models/shop';
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
        this.service.site(0).subscribe(site => {
            this.store.dispatch(setSite({site}));
        });
        this.service.cart().subscribe(cart => {
            this.store.dispatch(setCart({cart}));
        });
        this.service.categories().subscribe(res => {
            this.categories = res.data;
        });
        this.service.hotKeywords().subscribe(res => {
            this.hotItems = res.data;
        });
        this.service.notice().subscribe(res => {
            this.noticeItems = res.data;
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
        if (this.cart) {
            this.cartOpen = !this.cartOpen;
            return;
        }
        this.router.navigate(['cart'], {relativeTo: this.route});
    }

    public tapLogout() {
        this.authService.logout().subscribe(() => {
        });
    }

}
