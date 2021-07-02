import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { INav } from '../theme/components';
import { AppState } from '../theme/interfaces';
import { getCurrentUser } from '../theme/reducers/auth.selectors';
import { ThemeService } from '../theme/services';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent {

    public navItems: INav[] = [
        {
            name: '首页',
            icon: 'icon-home',
            url: './'
        },
        {
            name: '资金账户',
            icon: 'icon-th-large',
            url: './money',
            children: [
                {
                    name: '理财项目',
                    label: '项',
                    url: './money/project',
                },
                {
                    name: '理财产品',
                    label: '产',
                    url: './money/product',
                },
            ]
        },
        {
            name: '收支管理',
            icon: 'icon-calendar',
            url: './income',
            children: [
                {
                    name: '消费渠道',
                    label: '渠',
                    url: './income/channel',
                },
            ]
        },
        {
            name: '生活预算',
            icon: 'icon-gift',
            url: './budget'
        },
    ];

    public bottomNavs: INav[] = [
        {
            name: '请登录',
            icon: 'icon-user',
            url: './'
        },
        {
            name: '设置',
            icon: 'icon-cog',
            url: './setting'
        }
    ];

    constructor(
        private store: Store<AppState>,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle('个人财务');
        this.store.select(getCurrentUser).subscribe(user => {
            this.bottomNavs[0].name = user.name;
        });
    }

}
