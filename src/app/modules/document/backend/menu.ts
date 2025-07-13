import { INavLink } from '../../../theme/models/seo';

export const DocumentBackendMenu: INavLink[] = [
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
