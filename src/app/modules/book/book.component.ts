import { Component, DestroyRef, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { INavLink } from '../../theme/models/seo';
import { AppState } from '../../theme/interfaces';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { ThemeService } from '../../theme/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss']
})
export class BookComponent{
    private readonly store = inject<Store<AppState>>(Store);
    private readonly themeService = inject(ThemeService);
    private readonly destroyRef = inject(DestroyRef);


    public navItems: INavLink[] = [
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

    public bottomNavs: INavLink[] = [
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

    constructor() {
        this.themeService.titleChanged.next($localize `Book`);
        this.store.select(selectAuthUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
            if (!user) {
                return;
            }
            this.bottomNavs[0].name = user.name;
        });
    }

}
