import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../components/dialog';
import { ISite } from '../../../theme/models/seo';
import { setCart } from '../shop.actions';
import { ShopAppState } from '../shop.reducer';
import { selectSite } from '../shop.selectors';
import { ShopService } from '../shop.service';
import { ICategory } from '../model';

@Component({
    standalone: false,
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {
    private readonly service = inject(ShopService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly toastrService = inject(DialogService);
    private readonly store = inject<Store<ShopAppState>>(Store);


    public categories: ICategory[] = [];
    public tipItems: string[] =  [];
    public hotItems: string[] = [];
    public keywords = '';
    public site: ISite = {} as any;

    constructor() {
        this.store.select(selectSite).subscribe(site => {
            this.site = site || {} as any;
        });
    }

    ngOnInit(): void {
        this.service.batch({
            cart: {},
            category: {},
            hot_keywords: {},
            notice: {},
        }).subscribe({
            next: res => {
                this.store.dispatch(setCart({cart: res.cart}));
                this.categories = res.category;
                this.hotItems = res.hot_keywords;
            },
            error: err => {
                this.toastrService.error(err);
            }
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
        if (event.key !== 'Enter') {
            return;
        }
        this.tapSearch();
    }

    public tapSearch(keywords: string = this.keywords) {
        if (keywords.trim().length < 1) {
            this.toastrService.warning('请输入内容');
            document.documentElement.scrollTop = 0;
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

}
