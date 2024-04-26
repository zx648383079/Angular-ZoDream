import { INav } from '../../../theme/components';

export const AppBackendMenu: INav[] = [
    {
        name: '应用管理',
        icon: 'icon-APP',
        url: './',
        role: 'app_manage',
        children: [
            {
                name: '应用列表',
                label: 'app',
                url: './software',
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