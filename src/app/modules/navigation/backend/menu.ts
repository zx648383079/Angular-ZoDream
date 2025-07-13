import { INavLink } from '../../../theme/models/seo';

export const NavigationBackendMenu: INavLink[] = [
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
