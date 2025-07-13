import { INavLink } from '../../theme/models/seo';

export const OpenBackendMenu: INavLink[] = [
    {
        name: '开放平台',
        icon: 'icon-th-large',
        url: './',
        children: [
            {
                name: '应用管理',
                label: '应',
                url: './platform',
            },
            {
                name: '授权管理',
                label: '授',
                url: './authorize',
            },
            {
                name: '应用审核',
                label: '审',
                url: './platform/review',
                role: 'open_manage',
            },
        ],
    },
];
