import { INav } from '../../theme/components';

export const MicroBackendMenu: INav[] = [
    {
        name: '圈子管理',
        icon: 'icon-smile-o',
        url: './forum',
        children: [
            {
                name: '板块管理',
                label: '板',
                url: './forum',
            },
            {
                name: '帖子管理',
                label: '帖',
                url: './forum/thread',
            },
            {
                name: '屏蔽词管理',
                label: '词',
                url: './forum/setting/word',
            },
            {
                name: '表情包管理',
                label: '表',
                url: './forum/setting/emoji',
            },
        ],
    },
];
