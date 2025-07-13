import { INavLink } from '../../../theme/models/seo';

export const TVBackendMenu: INavLink[] = [
    {
        name: 'TV管理',
        icon: 'icon-globe',
        url: './',
        role: 'tv_manage',
        children: [
            {
                name: '影音列表',
                label: '影',
                url: './movie',
            },
            {
                name: '歌曲列表',
                label: '歌',
                url: './music',
            },
            {
                name: '直播列表',
                label: '播',
                url: './live',
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