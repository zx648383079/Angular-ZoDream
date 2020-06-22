import { Component, OnInit } from '@angular/core';
import { INav } from '../theme/components';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

    public navItems: INav[] = [
        {
            name: '首页',
            icon: 'icon-home',
            url: './'
        },
        {
            name: '分类',
            icon: 'icon-th-large',
            url: './category'
        },
        {
            name: '搜索',
            icon: 'icon-search',
            url: './search'
        },
        {
            name: '书单',
            icon: 'icon-gift',
            url: './list'
        },
    ];

    public bottomNavs: INav[] = [
    ];

    constructor() { }

    ngOnInit(): void {
    }

}
