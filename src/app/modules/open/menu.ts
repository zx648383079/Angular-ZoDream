import { INav } from '../../theme/components';

export const OpenBackendMenu: INav[] = [
    {
        name: '开放平台',
        icon: 'icon-th-large',
        url: './open',
        children: [
            {
                name: '应用管理',
                label: '应',
                url: './open/platform',
            },
            {
                name: '授权管理',
                label: '授',
                url: './open/authorize',
            },
            {
                name: '应用审核',
                label: '审',
                url: './open/platform/review',
                role: 'open_manage',
            },
        ],
    },
];
