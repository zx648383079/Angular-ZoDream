import { INav } from '../../theme/components';

export const ShopBackendMenu: INav[] = [
    {
        name: '商城',
        icon: 'icon-shopping-cart',
        url: './shop',
        role: 'shop_manage',
        children: [{
                name: '商品列表',
                label: '商',
                url: './shop/goods/list'
            },
            {
                name: '分类列表',
                label: '类',
                url: './shop/goods/category'
            },
            {
                name: '品牌列表',
                label: '品',
                url: './shop/goods/brand'
            },
            {
                name: '商品类型',
                label: '型',
                url: './shop/goods/group'
            },
            {
                name: '营销管理',
                label: '营',
                url: './shop/activity'
            },
            {
                name: '订单管理',
                label: '单',
                url: './shop/order'
            },
            {
                name: '文章管理',
                label: '文',
                url: './shop/article'
            },
            {
                name: '广告管理',
                label: '告',
                url: './shop/ad'
            },
            {
                name: '地区管理',
                label: '区',
                url: './shop/region'
            },
            {
                name: '仓库管理',
                label: '仓',
                url: './shop/warehouse'
            },
            {
                name: '插件管理',
                label: '插',
                url: './shop/plugin'
            },
            {
                name: '支付管理',
                label: '付',
                url: './shop/payment'
            },
            {
                name: '配送管理',
                label: '配',
                url: './shop/shipping'
            },
        ]
    },
];
