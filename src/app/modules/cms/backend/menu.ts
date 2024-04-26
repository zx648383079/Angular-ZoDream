import { INav } from '../../../theme/components';

export const CMSBackendMenu: INav[] = [
    {
        name: 'CMS管理',
        icon: 'icon-cloud',
        url: './',
        role: 'cms_manage',
        children: [
            {
                name: '站点管理',
                label: '站',
                url: './site',
            },
            // {
            //     name: '栏目管理',
            //     label: '栏',
            //     url: './category',
            // },
            // {
            //     name: '内容管理',
            //     label: '内',
            //     url: './site',
            // },
            // {
            //     name: '表单管理',
            //     label: '表',
            //     url: './site',
            // },
            {
                name: '模型管理',
                label: '模',
                url: './model',
            },
            {
                name: '分组管理',
                label: '组',
                url: './group',
            },
            {
                name: '联动管理',
                label: '联',
                url: './linkage',
            },
        ],
    },
];
