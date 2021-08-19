import { INav } from '../theme/components';
import { MenuReadyFn } from './menu.service';

export const backendMenuItems = [
    {
        name: '首页',
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

export const SmsBackendMenu: MenuReadyFn = function() {
    return [{
        name: '短信管理',
        icon: 'icon-mail',
        url: this.renderUrl(''),
        role: 'sms_manage',
        children: [{
                name: '签名管理',
                label: '签',
                url: this.renderUrl('signature'),
            },
            {
                name: '模板管理',
                label: '模',
                url: this.renderUrl('template'),
            },
            {
                name: '记录管理',
                label: '录',
                url: this.renderUrl('log'),
            },
            {
                name: '短信配置',
                label: '置',
                url: this.renderUrl('option'),
            },
        ],
    }];
};

export const backendBottomMenu: INav[] = [
    {
        name: '登录',
        icon: 'icon-user',
        url: './user/profile'
    },
    {
        name: '设置',
        icon: 'icon-cog',
        url: './user/setting',
    },
    {
        name: '返回前台',
        icon: 'icon-desktop',
        url: '/',
    }
];