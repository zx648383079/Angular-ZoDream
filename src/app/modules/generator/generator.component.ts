import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { INavLink } from '../../theme/models/seo';
import { AppState } from '../../theme/interfaces';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { ThemeService } from '../../theme/services';

@Component({
    standalone: false,
    selector: 'app-generator',
    templateUrl: './generator.component.html',
    styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly themeService = inject(ThemeService);


    public navItems: INavLink[] = [{
            name: $localize `Home`,
            icon: 'icon-home',
            url: './'
        },
        {
            name: '模板管理',
            icon: 'icon-calendar-o',
            children: [
                {
                    name: '控制器',
                    icon: 'icon-mobile',
                    url: './template/controller'
                },
                {
                    name: '数据模型',
                    icon: 'icon-th-list',
                    url: './template/model'
                },
                {
                    name: '生成器',
                    icon: 'icon-plus',
                    url: './template/migration'
                },
                {
                    name: 'CRUD',
                    icon: 'icon-rocket',
                    url: './template/crud'
                },
            ],
        },
        {
            name: '模块管理',
            icon: 'icon-line-chart',
            url: './module',
            children: [
                {
                    name: '安装',
                    icon: 'icon-bar-chart',
                    url: './module'
                },
                {
                    name: '卸载',
                    icon: 'icon-sign-out',
                    url: './module',
                    urlQuery: {
                        type: 1
                    }
                },
                {
                    name: '生成',
                    icon: 'icon-area-chart',
                    url: './module',
                    urlQuery: {
                        type: 2
                    }
                },
            ],
        },
        {
            name: '数据库管理',
            icon: 'icon-desktop',
            url: './database',
            children: [
                {
                    name: '查询',
                    icon: 'icon-search',
                    url: './database/query'
                },
                {
                    name: '导出',
                    icon: 'icon-download',
                    url: './database/export',
                },
                {
                    name: '导入',
                    icon: 'icon-upload',
                    url: './database/import',
                },
                {
                    name: '数据复制',
                    icon: 'icon-clone',
                    url: './database/copy',
                },
            ],
        },
    ];

    public bottomNavs: INavLink[] = [{
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
        this.themeService.titleChanged.next($localize `Generator`);
        this.store.select(selectAuthUser).subscribe(user => {
            if (!user) {
                return;
            }
            this.bottomNavs[0].name = user.name;
        });
    }

}
