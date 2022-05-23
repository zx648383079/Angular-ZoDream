import { INav } from '../../../theme/components';

export const TVBackendMenu: INav[] = [
    {
        name: 'TV管理',
        icon: 'icon-globe',
        url: './tv',
        role: 'tv_manage',
        children: [
            {
                name: '资源列表',
                label: '列',
                url: './tv/list',
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