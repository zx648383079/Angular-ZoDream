import { INav } from '../../../theme/components';

export const ResourceBackendMenu: INav[] = [
    {
        name: '资源管理',
        icon: 'icon-gift',
        url: './res',
        role: 'res_manage',
        children: [
            {
                name: '资源列表',
                label: '列',
                url: './res/list',
            },
            {
                name: '标签列表',
                label: '标',
                url: './res/tag',
            },
            {
                name: '评论列表',
                label: '评',
                url: './res/comment',
            },
        ],
    },
];