import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { StateChange } from 'ng-lazyload-image';
import { ToastrService } from 'ngx-toastr';
import { IGoods, IGoodsGallery } from '../../../theme/models/shop';
import { setCart } from '../../shop.actions';
import { ShopAppState } from '../../shop.reducer';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.scss']
})
export class GoodsComponent implements OnInit {

    public data: IGoods;
    public galleryItems: IGoodsGallery[] = [];
    public galleryIndex = 0;
    public content: SafeHtml;
    public tabIndex = 0;
    public recommendItems: IGoods[] = [];
    public hotItems: IGoods[] = [];
    public amount = 1;
    public stock = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: ShopService,
        private sanitizer: DomSanitizer,
        private toastrService: ToastrService,
        private store: Store<ShopAppState>,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.loadGoods(params.id);
        });
    }

    public loadGoods(id: any) {
        this.service.goods(id).subscribe(res => {
            this.data = res;
            this.stock = res.stock;
            this.content = this.sanitizer.bypassSecurityTrustHtml(res.content);
            this.galleryIndex = 0;
            this.galleryItems = [].concat([{thumb: res.thumb, image: res.picture}], res.gallery.map(i => {
                if (!i.thumb) {
                    i.thumb = i.image;
                }
                return i;
            }));
        });
    }

    public loadRecommend() {
        this.service.recommendList(this.data.id).subscribe(res => {
            this.recommendItems = res.data;
        });
    }

    public loadHot() {
        this.service.hotList(this.data.id).subscribe(res => {
            this.hotItems = res.data;
        });
    }

    public tapAmountMinus() {
        this.amount = Math.max(this.amount - 1, 1) || 1;
    }

    public onAmountChange() {
        if (this.amount < 1) {
            this.amount = 1;
            return;
        }
        const stock = this.stock;
        if (this.amount > stock) {
            this.amount = stock;
        }
    }

    public tapAmountPlus() {
        this.amount = Math.min(this.amount + 1, this.stock) || 1;
    }

    public tapBuy() {

    }

    public tapAddToCart() {
        this.service.cartAddGoods(this.data.id, this.amount).subscribe(cart => {
            if (cart.dialog) {
                return;
            }
            this.toastrService.success('加入购物车成功');
            this.store.dispatch(setCart({cart: cart as any}));
        });
    }

}
