import { INav } from '../../theme/components';

export const SystemtBackendMenu: INav[] = [
    {
        name: '系统设置',
        icon: 'icon-cog',
        url: './system',
        role: 'system_manage',
        children: [{
                name: '反馈留言',
                label: '馈',
                url: './contact/feedback',
            },
            {
                name: '投诉举报',
                label: '诉',
                url: './contact/report',
            },
            {
                name: '友情链接',
                label: '链',
                url: './contact/friend-link',
            },
            {
                name: '订阅',
                label: '订',
                url: './contact/subscribe',
            },
            {
                name: '屏蔽词管理',
                label: '词',
                url: './system/word',
            },
            {
                name: '表情包管理',
                label: '表',
                url: './system/emoji',
            },
            {
                name: '协议管理',
                label: '协',
                url: './system/agreement',
            },
            {
                name: '缓存',
                label: '缓',
                url: './system/cache',
            },
            {
                name: 'SiteMap',
                label: 'Map',
                url: './system/sitemap',
            },
            {
                name: '数据备份',
                label: '备',
                url: './system/sql',
            },
            {
                name: '插件管理',
                label: '插',
                url: './system/plugin',
            },
        ]
    },
];