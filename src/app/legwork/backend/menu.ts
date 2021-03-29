import { INav } from '../../theme/components';

export const LegworkBackendMenu: INav[] = [
    {
        name: '跑腿服务',
        icon: 'icon-rocket',
        url: './legwork',
        role: 'legwork_manage',
        children: [
            {
                name: '分类管理',
                label: '类',
                url: './legwork/category'
            },
            {
                name: '服务商管理',
                label: '商',
                url: './legwork/provider'
            },
            {
                name: '服务管理',
                label: '服',
                url: './legwork/service'
            },
            {
                name: '服务员管理',
                label: '员',
                url: './legwork/waiter'
            },
            {
                name: '订单管理',
                label: '订',
                url: './legwork/order'
            },
        ],
    }
];
