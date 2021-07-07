import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { INav } from '../theme/components';
import { AppState } from '../theme/interfaces';
import { getCurrentUser } from '../theme/reducers/auth.selectors';
import { ThemeService } from '../theme/services';

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
        {
            name: '请登录',
            icon: 'icon-user',
            url: './member'
        },
        {
            name: '设置',
            icon: 'icon-cog',
            url: './setting'
        },
        {
            name: '返回前台',
            icon: 'icon-desktop',
            url: '/',
        }
    ];

    constructor(private store: Store<AppState>,
        private themeService: ThemeService,) {
        this.themeService.setTitle('书城');
        this.store.select(getCurrentUser).subscribe(user => {
            this.bottomNavs[0].name = user.name;
        });
    }

    ngOnInit(): void {
    }

}
