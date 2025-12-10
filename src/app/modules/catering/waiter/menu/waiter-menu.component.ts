import { Component, OnChanges, OnInit, SimpleChanges, input } from '@angular/core';
import { INavLink } from '../../../../theme/models/seo';

@Component({
    standalone: false,
  selector: 'app-waiter-menu',
  templateUrl: './waiter-menu.component.html',
  styleUrls: ['./waiter-menu.component.scss']
})
export class WaiterMenuComponent implements OnChanges, OnInit {

    public items: INavLink[] = [
        {name: '统计', url: '', active: true},
        {name: '订单中心', url: 'order'},
        {name: '记录管理', url: 'log'},
    ];

    public readonly currentUrl = input<string>('');
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
        this.items = this.items.map(i => {
            i.active = secret ? url === i.url : url.startsWith(i.url);
            return i;
        });
    }

    private getBasePath() {
        const path = window.location.pathname;
        const i = path.indexOf('waiter');
        if (i < 0) {
            return 'catering/waiter/';
        }
        const args = path.substring(i + 8).split('/');
        const uri = args.filter(i => i !== '').map(i => {
            return '..';
        }).join('/');
        return uri.length > 1 ? uri + '/' : uri;
    }

}
