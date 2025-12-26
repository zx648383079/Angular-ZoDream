import { Component, OnInit, inject, signal } from '@angular/core';
import { IBrand, ICategory, IGoods, IComment } from '../../model';
import { ThemeService } from '../../../../theme/services';
import { ShopService } from '../../shop.service';
import { IAd } from '../../../ad-sense/model';

@Component({
    standalone: false,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    private readonly service = inject(ShopService);
    private readonly themeService = inject(ThemeService);


    public readonly bannerItems = signal<IAd[]>([]);
    public readonly brandItems = signal<IBrand[]>([]);
    public readonly newItems = signal<IGoods[]>([]);
    public readonly bestItems = signal<IGoods[]>([]);
    public readonly floorItems = signal<ICategory[]>([]);
    public readonly commentItems = signal<IComment[]>([]);

    ngOnInit() {
        this.themeService.titleChanged.next('商城');
        this.service.banners().subscribe(res => {
            this.bannerItems.set(res.data);
        });
    }

    public loadBrand() {
        this.service.brandRecommend().subscribe(res => {
            this.brandItems.set(res.data);
        });
    }

    public loadNew() {
        this.service.homeList().subscribe(res => {
            this.newItems.set(res.new_products);
            this.bestItems.set(res.best_products.splice(0, 7));
        });
    }

    public loadFloor() {
        this.service.categoryfloor().subscribe(res => {
            this.floorItems.set(res.data);
        });
    }

    public loadComment() {
        this.service.commentRecommend().subscribe(res => {
            this.commentItems.set(res.data);
        });
    }
}
