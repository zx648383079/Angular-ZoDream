import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { INav } from '../../theme/components';
import { AppState } from '../../theme/interfaces';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';
import { ThemeService } from '../../theme/services';

@Component({
    selector: 'app-disk',
    templateUrl: './disk.component.html',
    styleUrls: ['./disk.component.scss']
})
export class DiskComponent implements OnInit {

    public navItems: INav[] = [{
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
                },
                {
                    name: '文档',
                    icon: 'icon-file-word-o',
                    url: './catalog'
                },
                {
                    name: '视频',
                    icon: 'icon-file-movie-o',
                    url: './catalog'
                },
                {
                    name: '种子',
                    icon: 'icon-gift',
                    url: './catalog'
                },
                {
                    name: '音乐',
                    icon: 'icon-music',
                    url: './catalog'
                },
                {
                    name: '应用',
                    icon: 'icon-APP',
                    url: './catalog'
                },
                {
                    name: '压缩包',
                    icon: 'icon-file-archive-o',
                    url: './catalog'
                },
                {
                    name: '其他',
                    icon: 'icon-file-o',
                    url: './catalog'
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

    public bottomNavs: INav[] = [{
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

    constructor(
            private store: Store<AppState>,
            private themeService: ThemeService) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.bottomNavs[0].name = user.name;
        });
    }

    ngOnInit(): void {
        this.themeService.setTitle($localize `Disk`);
    }

}
