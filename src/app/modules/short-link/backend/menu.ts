import { INavLink } from '../../../theme/models/seo';

export const ShortLinkBackendMenu: INavLink[] = [
    {
        name: '短链接管理',
        icon: 'icon-chain',
        url: './',
        role: 'short_link_manage',
        children: [
            {
                name: '链接列表',
                label: '链',
                url: './list',
            },
        ],
    },
];
