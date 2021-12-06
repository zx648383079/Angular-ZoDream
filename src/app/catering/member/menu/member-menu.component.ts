import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { INav } from '../../../theme/components';

@Component({
  selector: 'app-member-menu',
  templateUrl: './member-menu.component.html',
  styleUrls: ['./member-menu.component.scss']
})
export class MemberMenuComponent implements OnChanges, OnInit {

    public items: INav[] = [
        {name: '个人中心', url: '', active: true},
        {name: '我的订单', url: 'order'},
        {name: '我的地址', url: 'address'},
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
        const i = path.indexOf('member');
        if (i < 0) {
            return 'catering/member/';
        }
        const args = path.substring(i + 8).split('/');
        const uri = args.filter(i => i !== '').map(i => {
            return '..';
        }).join('/');
        return uri.length > 1 ? uri + '/' : uri;
    }
}
