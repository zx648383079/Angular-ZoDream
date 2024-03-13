import { MenuReadyFn } from '../../../backend/menu.service';

export const BotBackendMenu: MenuReadyFn = function(_, account: number) {
    const items = // account ? 
    [
        {
            name: '消息列表',
            label: '消',
            url: this.renderUrl('reply'),
        },
        {
            name: '素材列表',
            label: '素',
            url: this.renderUrl('media'),
        },
        {
            name: '菜单列表',
            label: '菜',
            url: this.renderUrl('menu'),
        },
        {
            name: '二维码列表',
            label: '码',
            url: this.renderUrl('qrcode'),
        },
        {
            name: '用户列表',
            label: '用',
            url: this.renderUrl('user'),
        },
        {
            name: '记录列表',
            label: '记',
            url: this.renderUrl('log'),
        },
    ] ;//: [];
    return [
        {
            name: 'Bot管理',
            url: this.renderUrl(''),
            icon: 'icon-wechat',
            role: 'bot_manage',
            children: [
                {
                    name: '账号列表',
                    label: '账',
                    url: this.renderUrl('account'),
                },
                {
                    name: '模板样式',
                    label: '模',
                    url: this.renderUrl('template'),
                    role: 'bot_manage',
                },
                ...items,
            ]
        }
    ];
};