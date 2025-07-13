import { INavLink } from '../../theme/models/seo';

export const AdBackendMenu: INavLink[] = [
    {
        name: '广告管理',
        icon: 'icon-recycle',
        url: './',
        role: 'ad_manage',
        children: [
            {
                name: '广告列表',
                label: 'ad',
                url: './list',
            },
            {
                name: '广告位列表',
                label: '位',
                url: './position',
            },
        ],
    },
];