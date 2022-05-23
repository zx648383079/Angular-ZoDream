import { INav } from '../../../theme/components';

export const CMSBackendMenu: INav[] = [
    {
        name: 'CMS管理',
        icon: 'icon-cloud',
        url: './cms',
        role: 'cms_manage',
        children: [
            {
                name: '站点管理',
                label: '站',
                url: './cms/site',
            },
            // {
            //     name: '栏目管理',
            //     label: '栏',
            //     url: './cms/category',
            // },
            // {
            //     name: '内容管理',
            //     label: '内',
            //     url: './cms/site',
            // },
            // {
            //     name: '表单管理',
            //     label: '表',
            //     url: './cms/site',
            // },
            {
                name: '模型管理',
                label: '模',
                url: './cms/model',
            },
            {
                name: '分组管理',
                label: '组',
                url: './cms/group',
            },
            {
                name: '联动管理',
                label: '联',
                url: './cms/linkage',
            },
        ],
    },
];
