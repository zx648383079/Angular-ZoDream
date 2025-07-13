import { INavLink } from '../../../theme/models/seo';

export const CateringBackendMenu: INavLink[] = [
    {
        name: '餐饮管理',
        icon: 'icon-fire',
        url: './',
        role: 'catering_manage',
        children: [{
                name: '店铺列表',
                label: '店',
                url: './store',
            },
        ]
    },
];
