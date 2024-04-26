import { INav } from '../../../theme/components';

export const TrackerBackendMenu: INav[] = [
    {
        name: '行情管理',
        icon: 'icon-line-chart',
        url: './',
        role: 'tracker_manage',
        children: [
            {
                name: '货品列表',
                label: '货',
                url: './product',
            },
            {
                name: '行情记录',
                label: '情',
                url: './log',
            },
        ],
    },
];
