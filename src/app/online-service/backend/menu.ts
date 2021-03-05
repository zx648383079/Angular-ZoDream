import { INav } from '../../theme/components';

export const OnlineServiceBackendMenu: INav[] = [
    {
        name: '在线客服',
        icon: 'icon-rocket',
        url: './service',
        children: [
            {
                name: '分类管理',
                label: '类',
                url: './service/category'
            },
            {
                name: '客服管理',
                label: '人',
                url: './service/provider'
            },
            {
                name: '配置管理',
                label: '配',
                url: './service/option'
            },
        ],
    }
];
