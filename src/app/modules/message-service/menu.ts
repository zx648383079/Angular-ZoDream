import { MenuReadyFn } from '../../backend/menu.service';

export const MessageServiceBackendMenu: MenuReadyFn = function() {
    return [{
        name: '消息服务管理',
        icon: 'icon-mail',
        url: this.renderUrl(''),
        role: 'ms_manage',
        children: [
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
                label: '短',
                url: this.renderUrl('option/sms'),
            },
            {
                name: '邮箱配置',
                label: '邮',
                url: this.renderUrl('option/mail'),
            },
        ],
    }];
};