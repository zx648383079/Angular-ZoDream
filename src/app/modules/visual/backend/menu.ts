import { INav } from '../../../theme/components';

export const VisualBackendMenu: INav[] = [
    {
        name: '模板管理',
        icon: 'icon-zuhe',
        url: './visual',
        role: 'visual_manage',
        children: [
            {
                name: '站点列表',
                label: '站',
                url: './visual/site',
            },
            {
                name: '组件列表',
                label: '组',
                url: './visual/weight',
            },
        ],
    },
];