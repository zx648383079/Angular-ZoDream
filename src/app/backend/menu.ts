import { INav } from '../theme/components';

export const backendMenuItems = [
    {
        name: $localize `Home`,
        icon: 'icon-home',
        url: './'
    },
    {
        name: '我的',
        icon: 'icon-user',
        url: './user/profile',
        children: [{
                name: '消息',
                label: '短',
                url: './user/bulletin'
            },
            {
                name: '账户关联',
                label: '联',
                url: './user/connect'
            },
            {
                name: '操作记录',
                label: '操',
                url: './user/log'
            },
            {
                name: '登录记录',
                label: '登',
                url: './user/login-log'
            },
            {
                name: '修改密码',
                label: '密',
                url: './user/password'
            }
        ]
    },
    ,
];





export const backendBottomMenu: INav[] = [
    {
        name: $localize `Login in`,
        icon: 'icon-user',
        url: './user/profile'
    },
    {
        name: $localize `Setting`,
        icon: 'icon-cog',
        url: './user/setting',
    },
    {
        name: $localize `Back to home`,
        icon: 'icon-desktop',
        url: '/',
    }
];