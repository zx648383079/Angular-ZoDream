import { INav } from '../../../theme/components';

export const ShopBackendMenu: INav[] = [
    {
        name: '商城',
        icon: 'icon-shopping-cart',
        url: './',
        role: 'shop_manage',
        children: [{
                name: '商品列表',
                label: '商',
                url: './goods/list'
            },
            {
                name: '分类列表',
                label: '类',
                url: './goods/category'
            },
            {
                name: '品牌列表',
                label: '品',
                url: './goods/brand'
            },
            {
                name: '商品类型',
                label: '型',
                url: './goods/group'
            },
            {
                name: '营销管理',
                label: '营',
                url: './activity'
            },
            {
                name: '订单管理',
                label: '单',
                url: './order'
            },
            {
                name: '文章管理',
                label: '文',
                url: './article'
            },
            {
                name: '地区管理',
                label: '区',
                url: './region'
            },
            {
                name: '仓库管理',
                label: '仓',
                url: './warehouse'
            },
            {
                name: '插件管理',
                label: '插',
                url: './plugin'
            },
            {
                name: '支付管理',
                label: '付',
                url: './payment'
            },
            {
                name: '配送管理',
                label: '配',
                url: './shipping'
            },
        ]
    },
];
