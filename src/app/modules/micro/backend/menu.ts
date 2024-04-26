import { INav } from '../../../theme/components';

export const MicroBackendMenu: INav[] = [
    {
        name: '微博管理',
        icon: 'icon-at',
        url: './',
        role: 'micro_manage',
        children: [
            {
                name: '内容管理',
                label: '内',
                url: './post',
            },
            {
                name: '评论管理',
                label: '评',
                url: './comment',
            },
            {
                name: '话题管理',
                label: '话',
                url: './topic',
            },
        ],
    },
];
