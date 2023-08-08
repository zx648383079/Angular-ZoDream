import { INav } from '../../../theme/components';

export const CateringBackendMenu: INav[] = [
    {
        name: '餐饮管理',
        icon: 'icon-fire',
        url: './catering',
        role: 'catering_manage',
        children: [{
                name: '店铺列表',
                label: '店',
                url: './catering/store',
            },
        ]
    },
];
