import { INav } from '../../../theme/components';

export const ShortLinkBackendMenu: INav[] = [
    {
        name: '短链接管理',
        icon: 'icon-link',
        url: './short',
        role: 'short_link_manage',
        children: [
            {
                name: '链接列表',
                label: '链',
                url: './short/list',
            },
        ],
    },
];
