import { LegworkBackendMenu } from '../legwork/backend/menu';
import { VideoBackendMenu } from '../video/backend/menu';
import { ShopBackendMenu } from '../shop/backend/menu';
import { BlogBackendMenu } from '../blog/backend/menu';
import { BookBackendMenu } from '../book/backend/menu';
import { ForumBackendMenu } from '../forum/backend/menu';
import { OnlineServiceBackendMenu } from '../online-service/backend/menu';
import { DocumentBackendMenu } from '../document/backend/menu';
import { ExamBackendMenu } from '../exam/backend/menu';
import { MicroBackendMenu } from '../micro/backend/menu';
import { SystemtBackendMenu } from './system/menu';
import { CMSBackendMenu } from '../cms/backend/menu';
import { OpenBackendMenu } from './open/menu';

export const backendMenuItems = [
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
    {
        name: '会员管理',
        icon: 'icon-group',
        url: './auth',
        role: 'user_manage',
        children: [{
                name: '会户列表',
                label: '会',
                url: './auth/users'
            },
            {
                name: '角色权限',
                label: '角',
                url: './auth/role'
            },
            {
                name: '第三方管理',
                label: '三',
                url: './auth/oauth'
            },
            {
                name: '账户申请日志',
                label: '申',
                url: './auth/users/apply/log'
            },
            {
                name: '账户日志',
                label: '账',
                url: './auth/users/account/log'
            },
            {
                name: '会员操作日志',
                label: '操',
                url: './auth/users/action/log'
            },
            {
                name: '管理员日志',
                label: '管',
                url: './auth/admin/log'
            },
        ]
    },
    ...BlogBackendMenu,
    ...MicroBackendMenu,
    ...ShopBackendMenu,
    ...ForumBackendMenu,
    ...BookBackendMenu,
    ...VideoBackendMenu,
    ...LegworkBackendMenu,
    ...OnlineServiceBackendMenu,
    ...DocumentBackendMenu,
    ...ExamBackendMenu,
    ...CMSBackendMenu,
    ...OpenBackendMenu,
    {
        name: '短信管理',
        icon: 'icon-mail',
        url: './sms',
        role: 'sms_manage',
        children: [{
                name: '签名管理',
                label: '签',
                url: './sms/signature',
            },
            {
                name: '模板管理',
                label: '模',
                url: './sms/template',
            },
            {
                name: '记录管理',
                label: '录',
                url: './sms/log',
            },
            {
                name: '短信配置',
                label: '置',
                url: './sms/option',
            },
        ],
    },
    ...SystemtBackendMenu,
];

export const backendBottomMenu = [
    {
        name: '设置',
        icon: 'icon-cog',
        url: './system',
        role: 'system_manage',
    }
];