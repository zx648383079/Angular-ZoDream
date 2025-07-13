import { INavLink } from '../../../theme/models/seo';

export const VideoBackendMenu: INavLink[] = [
    {
        name: '短视频管理',
        icon: 'icon-film',
        url: './',
        role: 'video_manage',
        children: [
            {
                name: '视频列表',
                label: '视',
                url: './list',
            },
            {
                name: '评论管理',
                label: '评',
                url: './comment',
            },
            {
                name: '背景音乐管理',
                label: '音',
                url: './music',
            },
        ],
    },
];
