import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { INavLink } from '../../theme/models/seo';
import { AppState } from '../../theme/interfaces';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { ThemeService } from '../../theme/services';

@Component({
    standalone: false,
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

    public navItems: INavLink[] = [{
            name: '首页',
            icon: 'icon-home',
            url: './'
        },
        {
            name: '任务管理',
            icon: 'icon-desktop',
            url: './list',
            children: [
                {
                    name: '今日任务',
                    icon: 'icon-calendar-o',
                    url: './'
                },
                {
                    name: '任务列表',
                    icon: 'icon-th-list',
                    url: './list'
                },
                {
                    name: '任务计划',
                    icon: 'icon-calendar',
                    url: './plan'
                },
                {
                    name: '添加任务',
                    icon: 'icon-plus',
                    url: './create'
                },
            ],
        },
        {
            name: '工作统计',
            icon: 'icon-line-chart',
            url: './review',
            children: [
                {
                    name: '周视图',
                    icon: 'icon-bar-chart',
                    url: './review'
                },
                {
                    name: '月视图',
                    icon: 'icon-area-chart',
                    url: './review',
                    urlQuery: {
                        type: 1
                    }
                },
            ],
        },
        {
            name: '工作记录',
            icon: 'icon-history',
            url: './record',
            children: [
                {
                    name: '日视图',
                    icon: 'icon-clock-o',
                    url: './record'
                },
                {
                    name: '周视图',
                    icon: 'icon-th-list',
                    url: './record',
                    urlQuery: {
                        type: 1
                    }
                },
                {
                    name: '月视图',
                    icon: 'icon-calendar',
                    url: './record',
                    urlQuery: {
                        type: 2
                    }
                },
            ],
        },
        {
            name: '分享',
            icon: 'icon-share-alt',
            url: './share',
            children: [
                {
                    name: '我的分享',
                    icon: 'icon-paper-plane',
                    url: './share/my'
                },
                {
                    name: '参与的分享',
                    icon: 'icon-gift',
                    url: './share'
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

    constructor(
        private store: Store<AppState>,
        private themeService: ThemeService,
    ) {
        this.themeService.titleChanged.next('时间管理');
        this.store.select(selectAuthUser).subscribe(user => {
            if (!user) {
                return;
            }
            this.bottomNavs[0].name = user.name;
        });
    }

    ngOnInit() {
    }

}
