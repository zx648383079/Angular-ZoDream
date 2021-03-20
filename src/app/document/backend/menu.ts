import { INav } from '../../theme/components';

export const DocumentBackendMenu: INav[] = [
    {
        name: '文档管理',
        icon: 'icon-file-text-o',
        url: './doc',
        children: [
            {
                name: '文档列表',
                label: '板',
                url: './doc',
            },
        ],
    },
];
