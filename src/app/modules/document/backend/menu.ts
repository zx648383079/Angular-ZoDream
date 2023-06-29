import { INav } from '../../../theme/components';

export const DocumentBackendMenu: INav[] = [
    {
        name: '文档管理',
        icon: 'icon-file-text-o',
        url: './doc',
        role: 'doc_manage',
        children: [
            {
                name: '文档列表',
                label: '档',
                url: './doc',
            },
            {
                name: '文档分类',
                label: '类',
                url: './doc/category',
            },
            {
                name: 'API调试',
                label: 'DEBUG',
                url: './doc/debug',
            },
        ],
    },
];
