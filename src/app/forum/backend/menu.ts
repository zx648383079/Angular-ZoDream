import { INav } from '../../theme/components';

export const ForumBackendMenu: INav[] = [
    {
        name: '圈子管理',
        icon: 'icon-smile-o',
        url: './forum',
        role: 'forum_manage',
        children: [
            {
                name: '板块管理',
                label: '板',
                url: './forum/list',
            },
            {
                name: '帖子管理',
                label: '帖',
                url: './forum/thread',
            },
        ],
    },
];
