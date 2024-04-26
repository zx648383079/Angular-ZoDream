import { INav } from '../../../theme/components';

export const OnlineServiceBackendMenu: INav[] = [
    {
        name: '在线客服',
        icon: 'icon-service',
        url: './',
        role: 'service_manage',
        children: [
            {
                name: '分类管理',
                label: '类',
                url: './category'
            },
            {
                name: '快捷语管理',
                label: '语',
                url: './word'
            },
        ],
    }
];
