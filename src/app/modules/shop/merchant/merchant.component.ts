import { Component, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { INavLink } from '../../../theme/models/seo';
import { AppState } from '../../../theme/interfaces';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';
import { ThemeService } from '../../../theme/services';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnDestroy {
    private store = inject<Store<AppState>>(Store);
    private themeService = inject(ThemeService);


    public navItems: INavLink[] = [{
            name: '首页',
            icon: 'icon-home',
            url: './'
        },
        {
            name: '商品管理',
            icon: 'icon-th-large',
            url: './product',
            children: [
                {
                    name: '商品列表',
                    icon: 'icon-calendar-o',
                    url: './'
                },
                {
                    name: '添加商品',
                    icon: 'icon-plus',
                    url: './create'
                },
            ],
        },
        {
            name: '订单管理',
            icon: 'icon-line-chart',
            url: './order',
            children: [
                {
                    name: '订单列表',
                    icon: 'icon-bar-chart',
                    url: './review'
                },
                {
                    name: '发货列表',
                    icon: 'icon-area-chart',
                    url: './review',
                },
            ],
        },
        {
            name: '售后管理',
            icon: 'icon-service',
            url: './service',
            children: [
                {
                    name: '申请列表',
                    icon: 'icon-bar-chart',
                    url: './review'
                },
                {
                    name: '价格保护',
                    icon: 'icon-area-chart',
                    url: './review',
                },
            ],
        },
        {
            name: '营销管理',
            icon: 'icon-gift',
            url: './marketing',
            children: [
                {
                    name: '优惠券',
                    icon: 'icon-clock-o',
                    url: './record'
                },
            ],
        },
        {
            name: '财务管理',
            icon: 'icon-key',
            url: './finance',
            children: [
                {
                    name: '结算管理',
                    icon: 'icon-paper-plane',
                    url: './share/my'
                },
                {
                    name: '我的收益',
                    icon: 'icon-paper-plane',
                    url: './share/my'
                },
                {
                    name: '收支管理',
                    icon: 'icon-paper-plane',
                    url: './share/my'
                },
            ],
        },
    ];

    public bottomNavs: INavLink[] = [{
            name: 'zodream',
            icon: 'icon-user',
            url: './'
        },
        {
            name: $localize `Store Setting`,
            icon: 'icon-cog',
            url: './setting'
        },
        {
            name: $localize `Back to home`,
            icon: 'icon-desktop',
            url: '/shop',
        }
    ];
    private subItems = new Subscription();
    

    constructor() {
        this.themeService.titleChanged.next('商家中心');
        this.subItems.add(
            this.store.select(selectAuthUser).subscribe(user => {
                if (!user) {
                    return;
                }
                this.bottomNavs[0].name = user.name;
            })
        );
    }

    ngOnDestroy(): void {
        this.subItems.unsubscribe();
    }

}
