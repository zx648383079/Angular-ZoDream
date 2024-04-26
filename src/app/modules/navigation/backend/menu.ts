import { INav } from '../../../theme/components';

export const NavigationBackendMenu: INav[] = [
    {
        name: '导航管理',
        icon: 'icon-google',
        url: './',
        role: 'navigation_manage',
        children: [
            {
                name: '站点管理',
                label: '站',
                url: './site'
            },
            {
                name: '网页管理',
                label: '页',
                url: './page'
            },
        ],
    }
];
