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
                    name: $localize `Live visitors`,
                    icon: 'icon-clock-o',
                    url: './trend/real-time'
                },
                {
                    name: $localize `Trend analysis`,
                    icon: 'icon-bar-chart',
                    url: './trend/analysis'
                }
            ]
        },
        {
            name: $localize `Source analysis`,
            icon: 'icon-history',
            children: [
                {
                    name: $localize `All sources`,
                    icon: 'icon-th-list',
                    url: './source',
                },
                {
                    name: $localize `Search Engine`,
                    icon: 'icon-search',
                    url: './source',
                    urlQuery: {
                        type: 'engine'
                    }
                },
                {
                    name: $localize `Search words`,
                    icon: 'icon-commenting',
                    url: './source',
                    urlQuery: {
                        type: 'keywords'
                    }
                },
                {
                    name: $localize `External links`,
                    icon: 'icon-share-alt',
                    urlQuery: {
                        type: 'link'
                    }
                }
            ]
        },
        {
            name: $localize `Access Analysis`,
            icon: 'icon-eye',
            children: [
                {
                    name: $localize `Interviewed page`,
                    icon: 'icon-chain',
                    url: './visit/page'
                },
                {
                    name: $localize `Entry page`,
                    icon: 'icon-home',
                    url: './visit/enter'
                },
                {
                    name: $localize `Interviewed Domains`,
                    icon: 'icon-bookmark',
                    url: './visit/domain'
                },
                {
                    name: $localize `Page click map`,
                    icon: 'icon-file-text-o',
                    url: './visit/page-click'
                },
                {
                    name: $localize `Jump analysis`,
                    icon: 'icon-sign-out',
                    url: './visit/jump'
                }
            ]
        },
        {
            name: $localize `Visitor Analysis`,
            icon: 'icon-group',
            children: [
                {
                    name: $localize `Geographical distribution`,
                    icon: 'icon-globe',
                    url: './visitor/district'
                },
                {
                    name: $localize `System environment`,
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
