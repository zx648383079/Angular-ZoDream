import { INav } from '../../../theme/components';

export const ForumBackendMenu: INav[] = [
    {
        name: '论坛管理',
        icon: 'icon-smile-o',
        url: './',
        role: 'forum_manage',
        children: [
            {
                name: '板块管理',
                label: '板',
                url: '.list',
            },
            {
                name: '帖子管理',
                label: '帖',
                url: './thread',
            },
        ],
    },
];
