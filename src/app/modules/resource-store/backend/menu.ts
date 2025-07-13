import { INavLink } from '../../../theme/models/seo';

export const ResourceBackendMenu: INavLink[] = [
    {
        name: '资源管理',
        icon: 'icon-gift',
        url: './',
        role: 'res_manage',
        children: [
            {
                name: '资源列表',
                label: '列',
                url: './resource',
            },
            {
                name: '分类列表',
                label: 'app',
                url: './category',
            },
            {
                name: '标签列表',
                label: '标',
                url: './tag',
            },
            {
                name: '评论列表',
                label: '评',
                url: './comment',
            },
        ],
    },
];