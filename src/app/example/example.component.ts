import { Component, inject } from '@angular/core';
import { INavLink } from '../theme/models/seo';
import { SearchService, ThemeService } from '../theme/services';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestChangeEvent } from '../components/form';

@Component({
    standalone: false,
    selector: 'app-example',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.scss']
})
export class ExampleComponent {
    private readonly searchService = inject(SearchService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly themeService = inject(ThemeService);


    public navItems: INavLink[] = [
        {
            name: $localize `Home`,
            icon: 'icon-home',
            url: './home'
        },
        {
            name: $localize `Page`,
            icon: 'icon-file-o',
            children: [
                {
                    name: $localize `Search page`,
                    icon: 'icon-search',
                    url: './search'
                },
                {
                    name: $localize `Form page`,
                    icon: 'icon-edit',
                    url: './form'
                },
                {
                    name: $localize `Tour`,
                    icon: 'icon-paper-plane',
                    url: './tour'
                },
                {
                    name: $localize `Comment`,
                    icon: 'icon-comments',
                    url: './comment'
                }
            ]
        },
        {
            name: $localize `Files`,
            icon: 'icon-upload',
            children: [
                {
                    name: '文件上传',
                    icon: 'icon-file-o',
                    url: './file'
                },
                {
                    name: '多图上传',
                    icon: 'icon-image',
                    url: './file'
                },
                {
                    name: '资源管理',
                    icon: 'icon-folder-open-o',
                    url: './file'
                },
            ]
        },
        {
            name: $localize `Editor`,
            icon: 'icon-code',
            children: [
                {
                    name: '文字统计',
                    icon: 'icon-search',
                    url: './editor'
                },
                {
                    name: '富文本编辑器',
                    icon: 'icon-search',
                    url: './editor'
                },
                {
                    name: 'Markdown编辑器',
                    icon: 'icon-search',
                    url: './editor'
                },
                {
                    name: '代码编辑器',
                    icon: 'icon-search',
                    url: './editor'
                },
            ]
        },
        {
            name: $localize `Modal`,
            icon: 'icon-clone',
            children: [
                {
                    name: '通知',
                    icon: 'icon-search',
                    url: './modal'
                },
                {
                    name: '确认',
                    icon: 'icon-search',
                    url: './modal'
                },
                {
                    name: '弹出框',
                    icon: 'icon-search',
                    url: './modal'
                },
            ]
        },
        {
            name: $localize `Player`,
            icon: 'icon-music',
            children: [
                {
                    name: '音频播放',
                    icon: 'icon-search',
                    url: './player'
                },
                {
                    name: '视频播放',
                    icon: 'icon-search',
                    url: './player'
                },
                {
                    name: '音乐播放器',
                    icon: 'icon-search',
                    url: './player'
                },
            ]
        },
        {
            name: $localize `Charts`,
            icon: 'icon-area-chart',
            url: './chart',
        },
        {
            name: $localize `Components`,
            icon: 'icon-th-large',
            children: [
                {
                    name: '表单',
                    icon: 'icon-search',
                    url: './form/control'
                },
                {
                    name: '轮播图',
                    icon: 'icon-search',
                    url: './swiper'
                },
            ]
        },
    ];
    public bottomNavs: INavLink[] = [
        {
            name: $localize `Login in`,
            icon: 'icon-user',
            url: './login'
        },
        {
            name: $localize `Setting`,
            icon: 'icon-cog',
            url: './setting',
        },
        {
            name: $localize `Back to home`,
            icon: 'icon-desktop',
            url: '/',
        }
    ];

    constructor() {
        this.themeService.titleChanged.next($localize `Example`);
    }


    public onSearch(e: SuggestChangeEvent) {
        const keywords = e.text;
        if (!keywords) {
            return;
        }
        const items = [];
        for (let i = 0; i < 5; i++) {
            items.push(`Found ${keywords} - ${i}`);
        }
        e.suggest(items);
    }

    public tapSearch(keywords: string) {
        this.router.navigate(['search'], {relativeTo: this.route, queryParams: {keywords}})
    }
}
