import { MenuReadyFn } from '../../../backend/menu.service';

export const BotBackendMenu: MenuReadyFn = function(_, account: number) {
    const items = // account ? 
    [
        {
            name: '用户列表',
            label: '用',
            url: this.renderUrl('user'),
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