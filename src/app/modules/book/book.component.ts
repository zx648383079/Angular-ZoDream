import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { INav } from '../../theme/components';
import { AppState } from '../../theme/interfaces';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { ThemeService } from '../../theme/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnDestroy {

    public navItems: INav[] = [
        {
            name: $localize `Home`,
            icon: 'icon-home',
            url: './'
        },
        {
            name: $localize `Category`,
            icon: 'icon-th-large',
            url: './category'
        },
        {
            name: $localize `Search`,
            icon: 'icon-search',
            url: './search'
        },
        {
            name: $localize `Book list`,
            icon: 'icon-gift',
            url: './list'
        },
    ];

    public bottomNavs: INav[] = [
        {
            name: $localize `Login in`,
            icon: 'icon-user',
            url: './member'
        },
        {
            name: $localize `Setting`,
            icon: 'icon-cog',
            url: './setting'
        },
        {
            name: $localize `Back to home`,
            icon: 'icon-desktop',
            url: '/',
        }
    ];
    private subItems: Subscription[] = [];

    constructor(private store: Store<AppState>,
        private themeService: ThemeService,) {
        this.themeService.setTitle($localize `Book`);
        this.subItems.push(this.store.select(selectAuthUser).subscribe(user => {
            if (!user) {
                return;
            }
            this.bottomNavs[0].name = user.name;
        }));
    }

    ngOnDestroy(): void {
        for (const item of this.subItems) {
            item.unsubscribe();
        }
    }

}
