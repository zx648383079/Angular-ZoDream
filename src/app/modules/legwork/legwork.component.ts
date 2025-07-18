import { Component, OnInit } from '@angular/core';
import { INavLink } from '../../theme/models/seo';
import { ThemeService } from '../../theme/services';
import { LegworkService } from './legwork.service';

@Component({
    standalone: false,
  selector: 'app-legwork',
  templateUrl: './legwork.component.html',
  styleUrls: ['./legwork.component.scss']
})
export class LegworkComponent implements OnInit {

    public items: INavLink[] = this.renderNav();

    constructor(
        private service: LegworkService,
        private themeService: ThemeService,
    ) {
        this.themeService.titleChanged.next('跑腿');
        this.service.role().subscribe(res => {
            this.items = this.renderNav(res.is_waiter === 1, res.is_provider === 1);
        });
    }

    ngOnInit() {
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

    private renderNav(isWaiter = false, isProvider = false) {
        return [
            {
                name: '服务',
                children: [
                    {
                        name: '服务中心',
                        url: './'
                    },
                    {
                        name: '我的订单',
                        url: './order'
                    },
                ]
            },
            {
                name: '服务大厅',
                children: isWaiter ? [
                    {
                        name: '我的服务',
                        url: './waiter/center'
                    },
                    {
                        name: '我的订单',
                        url: './waiter/order'
                    },
                    {
                        name: '我的信息',
                        url: './waiter'
                    },
                ] : [
                    {
                        name: '申请成为服务员',
                        url: './waiter/apply'
                    },
                ]
            },
            {
                name: '服务商',
                children: isProvider ? [
                    {
                        name: '我的服务',
                        url: './provider/service'
                    },
                    {
                        name: '我的订单',
                        url: './provider/order'
                    },
                    {
                        name: '我的信息',
                        url: './provider'
                    },
                ] : [
                    {
                        name: '申请成为服务商',
                        url: './provider/apply'
                    },
                ]
            },
        ];
    }

}
