import { INav } from '../../../theme/components';

export const TVBackendMenu: INav[] = [
    {
        name: 'TV管理',
        icon: 'icon-globe',
        url: './tv',
        role: 'tv_manage',
        children: [
            {
                name: '影音列表',
                label: '影',
                url: './tv/movie',
            },
            {
                name: '歌曲列表',
                label: '歌',
                url: './tv/music',
            },
            {
                name: '直播列表',
                label: '播',
                url: './tv/live',
            },
            {
                name: '标签列表',
                label: '标',
                url: './tv/tag',
            },
            {
                name: '评论列表',
                label: '评',
                url: './tv/comment',
            },
        ],
    },
];