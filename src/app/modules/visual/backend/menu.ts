import { INavLink } from '../../../theme/models/seo';


export const VisualBackendMenu: INavLink[] = [
    {
        name: '模板管理',
        icon: 'icon-zuhe',
        url: './',
        role: 'visual_manage',
        children: [
            {
                name: '站点列表',
                label: '站',
                url: './site',
            },
            {
                name: '组件列表',
                label: '组',
                url: './weight',
            },
        ],
    },
];