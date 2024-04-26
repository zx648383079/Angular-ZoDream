import { INav } from '../../../theme/components';

export const LegworkBackendMenu: INav[] = [
    {
        name: '跑腿服务',
        icon: 'icon-rocket',
        url: './',
        role: 'legwork_manage',
        children: [
            {
                name: '分类管理',
                label: '类',
                url: './category'
            },
            {
                name: '服务商管理',
                label: '商',
                url: './provider'
            },
            {
                name: '服务管理',
                label: '服',
                url: './service'
            },
            {
                name: '服务员管理',
                label: '员',
                url: './waiter'
            },
            {
                name: '订单管理',
                label: '订',
                url: './order'
            },
        ],
    }
];
