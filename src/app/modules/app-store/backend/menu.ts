import { INav } from '../../../theme/components';

export const AppBackendMenu: INav[] = [
    {
        name: '应用管理',
        icon: 'icon-APP',
        url: './app',
        role: 'app_manage',
        children: [
            {
                name: '应用列表',
                label: 'app',
                url: './app/software',
            },
            {
                name: '分类列表',
                label: 'app',
                url: './app/category',
            },
            {
                name: '标签列表',
                label: '标',
                url: './app/tag',
            },
            {
                name: '评论列表',
                label: '评',
                url: './app/comment',
            },
        ],
    },
];