import { Component, OnInit, computed, effect, input, signal } from '@angular/core';
import { INavLink } from '../../../../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-merchant-menu',
    templateUrl: './merchant-menu.component.html',
    styleUrls: ['./merchant-menu.component.scss']
})
export class MerchantMenuComponent implements OnInit {

    public readonly items = signal<INavLink[]>([
        {name: '统计', url: '', active: true},
        {name: '订单管理', url: 'order'},
        {name: '商品管理', url: 'goods'},
        {name: '库存管理', url: 'stock'},
        {name: '采购单管理', url: 'stock/order'},
        {name: '食谱管理', url: 'recipe'},
        {name: '员工管理', url: 'staff'},
        {name: '会员管理', url: 'users'},
        {name: '店铺设置', url: 'setting'},
    ]);

    public readonly currentUrl = input<string>('');
    private basePath = '../';

    constructor() {
        effect(() => {
            this.checkUrl(this.currentUrl());
        });
    }

    ngOnInit(): void {
        this.basePath =  this.getBasePath();
    }

    public fullPath(item: INavLink) {
        const path = this.basePath + item.url;
        if (path.length < 1) {
            return './';
        }
        return path;
    }

    private checkUrl(url: string, secret = true) {
        this.basePath =  this.getBasePath();
        if (url.length < 0) {
            return;
        }
        this.items.update(v => {
            return v.map(i => {
                i.active = secret ? url === i.url : url.startsWith(i.url);
                return i;
            });
        });
    }

    private getBasePath() {
        const path = window.location.pathname;
        const i = path.indexOf('merchant');
        if (i < 0) {
            return 'catering/merchant/';
        }
        const args = path.substring(i + 8).split('/');
        const uri = args.filter(i => i !== '').map(i => {
            return '..';
        }).join('/');
        return uri.length > 1 ? uri + '/' : uri;
    }
}
