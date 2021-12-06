import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { INav } from '../../../theme/components';

@Component({
  selector: 'app-merchant-menu',
  templateUrl: './merchant-menu.component.html',
  styleUrls: ['./merchant-menu.component.scss']
})
export class MerchantMenuComponent implements OnChanges, OnInit {

    public items: INav[] = [
        {name: '统计', url: '', active: true},
        {name: '订单管理', url: 'order'},
        {name: '商品管理', url: 'goods'},
        {name: '库存管理', url: 'stock'},
        {name: '采购单管理', url: 'stock/order'},
        {name: '员工管理', url: 'staff'},
        {name: '会员管理', url: 'users'},
    ];

    @Input() public currentUrl: string = '';
    private basePath = '../';

    constructor() { }

    ngOnInit(): void {
        this.basePath =  this.getBasePath();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.currentUrl) {
            this.checkUrl(changes.currentUrl.currentValue);
        }
    }

    public fullPath(item: INav) {
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
        this.items = this.items.map(i => {
            i.active = secret ? url === i.url : url.startsWith(i.url);
            return i;
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
