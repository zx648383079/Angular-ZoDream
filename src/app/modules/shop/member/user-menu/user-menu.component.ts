import { Component, effect, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INavLink } from '../../../../theme/models/seo';


@Component({
    standalone: false,
    selector: 'app-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {

    public items: INavLink[] = [{
            name: '账号管理',
            children: [{
                name: '个人中心',
                url: '/shop/member'
            }, {
                name: '消息通知',
                url: '/shop/member/message'
            }, {
                name: '帐号信息',
                url: '/shop/member/profile'
            }, {
                name: '地址管理',
                url: '/shop/member/address'
            }, {
                name: '帐号安全 ',
                url: '/shop/member/account/center'
            }, {
                name: '我的余额',
                url: '/shop/member/account'
            }, {
                name: '我的收藏',
                url: '/shop/member/collect'
            }, {
                name: '我的足迹',
                url: '/shop/member/history'
            }, ]
        },
        {
            name: '交易管理',
            children: [{
                    name: '订单管理',
                    url: '/shop/member/order'
                },
                {
                    name: '我的红包',
                    url: '/shop/member/bonus'
                },
                {
                    name: '优惠券',
                    url: '/shop/member/coupon'
                },
                // {
                //     name: '礼品卡',
                //     url: '/shop/member/'
                // },
                // {
                //     name: '优先购',
                //     url: '/shop/member/'
                // },
                // {
                //     name: '我的众筹',
                //     url: '/shop/member/'
                // },

            ]
        },
        {
            name: '服务中心',
            children: [{
                    name: '售后记录',
                    url: '/shop/member/refund'
                },
                {
                    name: '价格保护',
                    url: '/shop/member/price_protect'
                },
                {
                    name: '帮助中中心',
                    url: '/shop/market/article/help'
                },
            ]
        },
    ];

    public readonly current = input<ActivatedRoute>(undefined);
    public readonly currentUrl = input<string>(undefined);

    constructor() {
        effect(() => {
            this.checkRoute(this.current());
        });
        effect(() => {
            this.checkUrl(this.currentUrl());
        });
    }

    public tapNav(item: INavLink) {
        this.items = this.items.map(group => {
            group.children = group.children.map(i => {
                i.active = i === item;
                return i;
            });
            return group;
        });
    }

    private checkRoute(route: ActivatedRoute) {
        route.url.subscribe(res => {
            this.checkUrl(res.map(i => i.path).join('/'), false);
        });
    }

    private checkUrl(url: string, secret = true) {
        if (url.length < 0) {
            return;
        }
        if (!url.startsWith('/shop/')) {
            url = '/shop/' + url;
        }
        this.items = this.items.map(group => {
            group.children = group.children.map(i => {
                i.active = secret ? url === i.url : url.startsWith(i.url);
                return i;
            });
            return group;
        });
    }
}
