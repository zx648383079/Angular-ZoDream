import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { INav } from '../../theme/components';
import { AppState } from '../../theme/interfaces';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';
import { ThemeService } from '../../theme/services';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent {

    public navItems: INav[] = [{
            name: '首页',
            icon: 'icon-home',
            url: './'
        },
        {
            name: '商品管理',
            icon: 'icon-desktop',
            url: './goods',
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
            url: './review',
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
            name: '营销管理',
            icon: 'icon-history',
            url: './record',
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
            icon: 'icon-share-alt',
            url: './share',
            children: [
                {
                    name: '资金记录',
                    icon: 'icon-paper-plane',
                    url: './share/my'
                },
            ],
        },
    ];

    public bottomNavs: INav[] = [{
            name: 'zodream',
            icon: 'icon-user',
            url: './'
        },
        {
            name: '设置',
            icon: 'icon-cog',
            url: './setting'
        },
        {
            name: '返回前台',
            icon: 'icon-desktop',
            url: '/shop',
        }
    ];

    constructor(
        private store: Store<AppState>,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle('商家中心');
        this.store.select(getCurrentUser).subscribe(user => {
            if (!user) {
                return;
            }
            this.bottomNavs[0].name = user.name;
        });
    }

}
