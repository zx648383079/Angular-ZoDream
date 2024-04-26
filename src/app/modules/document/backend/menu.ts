import { INav } from '../../../theme/components';

export const DocumentBackendMenu: INav[] = [
    {
        name: '文档管理',
        icon: 'icon-file-text-o',
        url: './',
        role: 'doc_manage',
        children: [
            {
                name: '文档列表',
                label: '档',
                url: './',
            },
            {
                name: '文档分类',
                label: '类',
                url: './category',
            },
            {
                name: 'API调试',
                label: 'DEBUG',
                url: './debug',
            },
        ],
    },
];
