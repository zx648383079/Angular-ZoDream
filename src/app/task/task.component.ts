import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { INav } from '../theme/components';
import { AppState } from '../theme/interfaces';
import { getCurrentUser } from '../theme/reducers/selectors';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

    public navItems: INav[] = [{
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
                    name: '添加任务',
                    icon: 'icon-plus',
                    url: './create'
                },
            ],
        },
        {
            name: '工作统计',
            icon: 'icon-line-chart',
            url: './list',
            children: [
                {
                    name: '周视图',
                    icon: 'icon-bar-chart',
                    url: './'
                },
                {
                    name: '月视图',
                    icon: 'icon-area-chart',
                    url: './list'
                },
            ],
        },
        {
            name: '工作记录',
            icon: 'icon-history',
            url: './list',
            children: [
                {
                    name: '日视图',
                    icon: 'icon-clock-o',
                    url: './'
                },
                {
                    name: '周视图',
                    icon: 'icon-th-list',
                    url: './'
                },
                {
                    name: '月视图',
                    icon: 'icon-calendar',
                    url: './list'
                },
            ],
        },
        {
            name: '分享',
            icon: 'icon-share-alt',
            url: './list',
            children: [
                {
                    name: '我的分享',
                    icon: 'icon-paper-plane',
                    url: './'
                },
                {
                    name: '参与的分享',
                    icon: 'icon-gift',
                    url: './'
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
        }
    ];

    constructor(
        private store: Store < AppState > ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.bottomNavs[0].name = user.name;
        });
    }

    ngOnInit() {
    }

}