import { Component, OnInit } from '@angular/core';
import SwiperCore from 'swiper/core';

import { IAd, IBrand, ICategory, IGoods, IComment } from '../../../theme/models/shop';
import { ThemeService } from '../../../theme/services';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public bannerItems: IAd[] = [];
    public brandItems: IBrand[] = [];
    public newItems: IGoods[] = [];
    public bestItems: IGoods[] = [];
    public floorItems: ICategory[] = [];
    public commentItems: IComment[] = [];

    constructor(
        private service: ShopService,
        private themeService: ThemeService,
    ) { }

    ngOnInit() {
        this.themeService.setTitle('商城');
        this.service.banners().subscribe(res => {
            this.bannerItems = res.data;
        });
    }

    public loadBrand() {
        this.service.brandRecommend().subscribe(res => {
            this.brandItems = res.data;
        });
    }

    public loadNew() {
        this.service.homeList().subscribe(res => {
            this.newItems = res.new_products;
            this.bestItems = res.best_products.splice(0, 7);
        });
    }

    public loadFloor() {
        this.service.categoryfloor().subscribe(res => {
            this.floorItems = res.data;
        });
    }

    public loadComment() {
        this.service.commentRecommend().subscribe(res => {
            this.commentItems = res.data;
        });
    }
}
