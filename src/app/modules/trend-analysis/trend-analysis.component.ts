import { Component } from '@angular/core';
import { INav } from '../../theme/components';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { ThemeService } from '../../theme/services';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';

@Component({
  selector: 'app-trend-analysis',
  templateUrl: './trend-analysis.component.html',
  styleUrls: ['./trend-analysis.component.scss']
})
export class TrendAnalysisComponent {

    public navItems: INav[] = [
        {
            name: $localize `Home`,
            icon: 'icon-home',
            url: './'
        },
        {
            name: $localize `Trend Analysis`,
            icon: 'icon-line-chart',
            children: [
                {
                    name: '实时访客',
                    icon: 'icon-clock-o',
                    url: './trend/real-time'
                },
                {
                    name: '趋势分析',
                    icon: 'icon-bar-chart',
                    url: './trend/analysis'
                }
            ]
        },
        {
            name: '来源分析',
            icon: 'icon-history',
            children: [
                {
                    name: '全部来源',
                    icon: 'icon-th-list',
                    url: './source',
                },
                {
                    name: '搜索引擎',
                    icon: 'icon-search',
                    url: './source',
                    urlQuery: {
                        type: 'engine'
                    }
                },
                {
                    name: '搜索词',
                    icon: 'icon-commenting',
                    url: './source',
                    urlQuery: {
                        type: 'keywords'
                    }
                },
                {
                    name: '外部链接',
                    icon: 'icon-share-alt',
                    urlQuery: {
                        type: 'link'
                    }
                }
            ]
        },
        {
            name: '访问分析',
            icon: 'icon-eye',
            children: [
                {
                    name: '受访页面',
                    icon: 'icon-chain',
                    url: './visit/page'
                },
                {
                    name: '入口页面',
                    icon: 'icon-home',
                    url: './visit/enter'
                },
                {
                    name: '受访域名',
                    icon: 'icon-bookmark',
                    url: './visit/domain'
                },
                {
                    name: '页面点击图',
                    icon: 'icon-file-text-o',
                    url: './visit/page-click'
                },
                {
                    name: '跳转分析',
                    icon: 'icon-sign-out',
                    url: './visit/jump'
                }
            ]
        },
        {
            name: '访客分析',
            icon: 'icon-group',
            children: [
                {
                    name: '地域分布',
                    icon: 'icon-globe',
                    url: './visitor/district'
                },
                {
                    name: '系统环境',
                    icon: 'icon-desktop',
                    url: './visitor/broswer'
                },
            ]
        },
    ];

    public bottomNavs: INav[] = [
        {
            name: $localize `Login in`,
            icon: 'icon-user',
            url: './member'
        },
        {
            name: $localize `Back to home`,
            icon: 'icon-desktop',
            url: '/',
        }
    ];

    constructor(private store: Store<AppState>,
        private themeService: ThemeService,) {
        this.themeService.setTitle($localize `Trend Analysis`);
        this.store.select(selectAuthUser).subscribe(user => {
            if (!user) {
                return;
            }
            this.bottomNavs[0].name = user.name;
        });
    }

}
