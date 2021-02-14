import { Component, OnInit } from '@angular/core';
import { INav } from '../theme/components';

@Component({
  selector: 'app-legwork',
  templateUrl: './legwork.component.html',
  styleUrls: ['./legwork.component.scss']
})
export class LegworkComponent implements OnInit {

    public items: INav[] = [
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
            children: [
                {
                    name: '我的服务',
                    url: './'
                },
                {
                    name: '我的订单',
                    url: './order'
                },
            ]
        },
        {
            name: '服务商',
            children: [
                {
                    name: '我的服务',
                    url: './'
                },
                {
                    name: '我的订单',
                    url: './order'
                },
                {
                    name: '我的员工',
                    url: './order'
                },
            ]
        },
    ];

    constructor() { }

    ngOnInit() {
    }

    public tapNav(item: INav) {
        this.items = this.items.map(group => {
            group.children = group.children.map(i => {
                i.active = i === item;
                return i;
            });
            return group;
        });
    }

}
