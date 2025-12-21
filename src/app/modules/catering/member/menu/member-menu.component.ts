import { Component, OnInit, effect, input, signal } from '@angular/core';
import { INavLink } from '../../../../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-member-menu',
    templateUrl: './member-menu.component.html',
    styleUrls: ['./member-menu.component.scss']
})
export class MemberMenuComponent implements OnInit {

    public readonly items = signal<INavLink[]>([
        {name: '个人中心', url: '', active: true},
        {name: '我的订单', url: 'order'},
        {name: '我的地址', url: 'address'},
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
