import { MenuReadyFn } from '../../backend/menu.service';

export const WechatBackendMenu: MenuReadyFn = function(_, account: number) {
    const items = account ? [
        {
            name: '消息列表',
            url: this.renderUrl('reply'),
        },
        {
            name: '素材列表',
            url: this.renderUrl('media'),
        },
        {
            name: '菜单列表',
            url: this.renderUrl('menu'),
        },
        {
            name: '用户列表',
            url: this.renderUrl('user'),
        },
        {
            name: '记录列表',
            url: this.renderUrl('log'),
        },
    ] : [];
    return [
        {
            name: '公众号管理',
            url: this.renderUrl(''),
            icon: 'icon-wechat',
            children: [
                {
                    name: '账号列表',
                    url: this.renderUrl('account'),
                },
                {
                    name: '模板样式',
                    url: this.renderUrl('template'),
                },
                ...items,
            ]
        }
    ];
};