import { INav } from '../../../theme/components';

export const VideoBackendMenu: INav[] = [
    {
        name: '短视频管理',
        icon: 'icon-film',
        url: './video',
        role: 'video_manage',
        children: [
            {
                name: '视频列表',
                label: '视',
                url: './video/list',
            },
            {
                name: '评论管理',
                label: '评',
                url: './video/comment',
            },
            {
                name: '背景音乐管理',
                label: '音',
                url: './video/music',
            },
        ],
    },
];
