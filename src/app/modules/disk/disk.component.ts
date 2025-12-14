import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { INavLink } from '../../theme/models/seo';
import { AppState } from '../../theme/interfaces';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { ThemeService } from '../../theme/services';

@Component({
    standalone: false,
    selector: 'app-disk',
    templateUrl: './disk.component.html',
    styleUrls: ['./disk.component.scss']
})
export class DiskComponent implements OnInit {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly themeService = inject(ThemeService);


    public navItems: INavLink[] = [{
            name: '首页',
            icon: 'icon-home',
            url: './'
        },
        {
            name: '全部文件',
            icon: 'icon-folder-open-o',
            url: './catalog',
            expand: true,
            children: [{
                    name: '图片',
                    icon: 'icon-file-image-o',
                    url: './catalog',
                    urlQuery: {
                        type: 'image'
                    }
                },
                {
                    name: '文档',
                    icon: 'icon-file-word-o',
                    url: './catalog',
                    urlQuery: {
                        type: 'doc'
                    }
                },
                {
                    name: '视频',
                    icon: 'icon-file-movie-o',
                    url: './catalog',
                    urlQuery: {
                        type: 'movie'
                    }
                },
                {
                    name: '种子',
                    icon: 'icon-gift',
                    url: './catalog',
                    urlQuery: {
                        type: 'bt'
                    }
                },
                {
                    name: '音乐',
                    icon: 'icon-music',
                    url: './catalog',
                    urlQuery: {
                        type: 'music'
                    }
                },
                {
                    name: '应用',
                    icon: 'icon-APP',
                    url: './catalog',
                    urlQuery: {
                        type: 'app'
                    }
                },
                {
                    name: '压缩包',
                    icon: 'icon-file-archive-o',
                    url: './catalog',
                    urlQuery: {
                        type: 'archive'
                    }
                },
                {
                    name: '其他',
                    icon: 'icon-file-o',
                    url: './catalog',
                    urlQuery: {
                        type: 'other'
                    }
                }
            ]
        },
        {
            name: '我的分享',
            icon: 'icon-share-alt',
            url: './share'
        },
        {
            name: '回收站',
            icon: 'icon-trash',
            url: './trash'
        }
    ];

    public bottomNavs: INavLink[] = [{
            name: 'zodream',
            icon: 'icon-user',
            url: './auth/profile'
        },
        {
            name: '设置',
            icon: 'icon-cog',
            url: './system'
        },
        {
            name: '返回前台',
            icon: 'icon-desktop',
            url: '/',
        }
    ];

    constructor() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.bottomNavs[0].name = user.name;
        });
    }

    ngOnInit(): void {
        this.themeService.titleChanged.next($localize `Disk`);
    }

}
