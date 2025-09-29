import { Component, OnDestroy } from '@angular/core';
import { INavLink } from '../../../theme/models/seo';
import { Subscription } from 'rxjs';
import { AppState } from '../../../theme/interfaces';
import { Store } from '@ngrx/store';
import { ThemeService } from '../../../theme/services';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';

@Component({
    standalone: false,
    selector: 'app-game-profiler',
    templateUrl: './game-profiler.component.html',
    styleUrls: ['./game-profiler.component.scss']
})
export class GameProfilerComponent implements OnDestroy {

public navItems: INavLink[] = [
        {
            name: $localize `Home`,
            icon: 'icon-home',
            url: './'
        },
        {
            name: $localize `Avatar`,
            icon: 'icon-group',
            url: './avatar'
        },
        {
            name: $localize `Map`,
            icon: 'icon-globe',
            url: './map'
        },
        {
            name: $localize `Lottery`,
            icon: 'icon-gift',
            url: './lottery'
        },
        {
            name: $localize `Items`,
            icon: 'icon-folder-o',
            url: './item'
        },
    ];

    public bottomNavs: INavLink[] = [
        {
            name: $localize `Login in`,
            icon: 'icon-user',
        },
        {
            name: $localize `Back to home`,
            icon: 'icon-desktop',
            url: '/',
        }
    ];
    private subItems = new Subscription();

    constructor(private store: Store<AppState>,
        private themeService: ThemeService,) {
        this.themeService.titleChanged.next($localize `Game Profiler`);
        this.subItems.add(this.store.select(selectAuthUser).subscribe(user => {
            if (!user) {
                return;
            }
            this.bottomNavs[0].name = user.name;
        }));
    }

    ngOnDestroy(): void {
        this.subItems.unsubscribe();
    }

}
