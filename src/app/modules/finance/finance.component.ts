import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { INavLink } from '../../theme/models/seo';
import { AppState } from '../../theme/interfaces';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { ThemeService } from '../../theme/services';

@Component({
    standalone: false,
    selector: 'app-finance',
    templateUrl: './finance.component.html',
    styleUrls: ['./finance.component.scss']
})
export class FinanceComponent {
    private store = inject<Store<AppState>>(Store);
    private themeService = inject(ThemeService);


    public navItems: INavLink[] = [
        {
            name: $localize `Home`,
            icon: 'icon-home',
            url: './',
            tabletEnabled: true,
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
            tabletEnabled: true,
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
            url: './budget',
            tabletEnabled: true,
        },
    ];

    public bottomNavs: INavLink[] = [
        {
            name: $localize `Login in`,
            icon: 'icon-user',
            url: './'
        },
        {
            name: $localize `Setting`,
            icon: 'icon-cog',
            url: './setting'
        },
        {
            name: $localize `Back to home`,
            icon: 'icon-desktop',
            url: '/',
        }
    ];

    constructor() {
        this.themeService.titleChanged.next('个人财务');
        this.store.select(selectAuthUser).subscribe(user => {
            this.bottomNavs[0].name = user.name;
        });
    }

}
