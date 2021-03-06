import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../dialog';
import { IActivity, ICartGroup, ICoupon, IGoods, IGoodsGallery } from '../../../theme/models/shop';
import { ThemeService } from '../../../theme/services';
import { mapFormat } from '../../../theme/utils';
import { setCart, setCheckoutCart } from '../../shop.actions';
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
    public content: SafeHtml;
    public tabIndex = 0;
    public recommendItems: IGoods[] = [];
    public hotItems: IGoods[] = [];
    public amount = 1;
    public stock = 0;
    public activity: IActivity<any>;
    public couponItems: ICoupon[] = [];
    public promoteItems: IActivity[] = [];
    public regionId = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: ShopService,
        private sanitizer: DomSanitizer,
        private toastrService: DialogService,
        private store: Store<ShopAppState>,
        private themeService: ThemeService,
    ) { }

    ngOnInit() {
        this.regionId = this.service.regionId;
        this.route.params.subscribe(params => {
            this.loadGoods(params.id);
        });
    }

    public loadGoods(id: any) {
        this.service.goods(id).subscribe({
            next: res => {
                this.themeService.setTitle(res.seo_title || res.name);
                this.data = res;
                this.stock = res.stock;
                this.content = this.sanitizer.bypassSecurityTrustHtml(res.content);
                this.galleryItems = [].concat([{thumb: res.thumb, image: res.picture}], res.gallery ? res.gallery.map(i => {
                    if (!i.thumb) {
                        i.thumb = i.image;
                    }
                    return i;
                }) : []);
                this.couponItems = res.coupons || [];
                this.promoteItems = res.promotes || [];
            },
            error: err => {
                this.toastrService.warning(err);
                history.back();
            }
        });
    }

    public formatPromote(value: number) {
        return mapFormat(value, ['', '拍卖', '秒杀', '团购', '优惠', '组合', '返现', '预售', '砍价', '抽奖', '试用']);
    }

    public onRegionChange() {
        this.service.regionId = this.regionId;
        this.service.goodsStock(this.data.id).subscribe({
            next: res => {
                this.stock = res.stock;
            },
            error: err => {
                this.toastrService.warning(err);
            }
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

    public tapBuy() {
        const data: ICartGroup[] = [
            {
                name: this.data.shop + '',
                goods_list: [
                    {
                        goods_id: this.data.id,
                        amount: this.amount,
                        goods: this.data,
                        price: this.data.price,
                    },
                ],
            },
        ];
        this.store.dispatch(setCheckoutCart({
            items: data
        }));
        this.router.navigate(['../../cashier'], {relativeTo: this.route});
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

    /**
     * tapCollect
     */
    public tapCollect() {
        this.service.toggleCollect(this.data.id).subscribe(res => {
            this.data.is_collect = res.data;
        });
    }

}
