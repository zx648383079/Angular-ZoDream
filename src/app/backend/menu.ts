import { INav } from '../theme/components';
import { MenuReadyFn } from './menu.service';

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

export const AuthBackendMenu: MenuReadyFn = function() {
    return [
        {
            name: '会员管理',
            icon: 'icon-group',
            url: this.renderUrl(''),
            role: 'user_manage',
            children: [{
                    name: '会户列表',
                    label: '会',
                    url: this.renderUrl('users')
                },
                {
                    name: '角色权限',
                    label: '角',
                    url: this.renderUrl('role')
                },
                {
                    name: '第三方管理',
                    label: '三',
                    url: this.renderUrl('oauth')
                },
                {
                    name: '权益卡管理',
                    label: '卡',
                    url: this.renderUrl('card')
                },
                {
                    name: '邀请码管理',
                    label: '邀',
                    url: this.renderUrl('invite/code')
                },
                {
                    name: '账户申请日志',
                    label: '申',
                    url: this.renderUrl('users/apply/log')
                },
                {
                    name: '账户日志',
                    label: '账',
                    url: this.renderUrl('users/account/log')
                },
                {
                    name: '会员操作日志',
                    label: '操',
                    url: this.renderUrl('users/action/log')
                },
                {
                    name: '管理员日志',
                    label: '管',
                    url: this.renderUrl('admin/log')
                },
            ]
        }
    ];
}



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