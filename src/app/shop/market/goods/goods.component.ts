import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../dialog';
import { IActivity, ICartGroup, IComment, ICoupon, IGoods, IGoodsGallery } from '../../../theme/models/shop';
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
    public galleryIndex = 0;
    public content: SafeHtml;
    public tabIndex = 0;
    public recommendItems: IGoods[] = [];
    public hotItems: IGoods[] = [];
    public amount = 1;
    public stock = 0;
    public activity: IActivity<any>;
    public commentSubtotal: any;
    public commentItems: IComment[] = [];
    public logItems: any[] = [];
    public couponItems: ICoupon[] = [];
    public promoteItems: IActivity[] = [];

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
        this.route.params.subscribe(params => {
            this.loadGoods(params.id);
        });
    }

    public loadGoods(id: any) {
        this.service.goods(id).subscribe(res => {
            this.themeService.setTitle(res.name);
            this.data = res;
            this.stock = res.stock;
            this.content = this.sanitizer.bypassSecurityTrustHtml(res.content);
            this.galleryIndex = 0;
            this.galleryItems = [].concat([{thumb: res.thumb, image: res.picture}], res.gallery ? res.gallery.map(i => {
                if (!i.thumb) {
                    i.thumb = i.image;
                }
                return i;
            }) : []);
            this.couponItems = res.coupons || [];
            this.promoteItems = res.promotes || [];
        });
    }

    public formatPromote(value: number) {
        return mapFormat(value, ['', '拍卖', '秒杀', '团购', '优惠', '组合', '返现', '预售', '砍价', '抽奖', '试用']);
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
