import { MenuReadyFn } from '../../../backend/menu.service';

export const CheckInBackendMenu: MenuReadyFn = function() {
    return [
        {
            name: '签到管理',
            url: this.renderUrl(''),
            icon: 'icon-calendar',
            children: [
                {
                    name: '设置',
                    url: this.renderUrl('option'),
                },
            ]
        }
    ];
};