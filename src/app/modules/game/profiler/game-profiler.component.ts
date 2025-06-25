import { Component, OnDestroy } from '@angular/core';
import { INav } from '../../../theme/components';
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

public navItems: INav[] = [
        {
            name: $localize `Home`,
            icon: 'icon-home',
            url: './'
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

    public bottomNavs: INav[] = [
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
    private subItems: Subscription[] = [];

    constructor(private store: Store<AppState>,
        private themeService: ThemeService,) {
        this.themeService.setTitle($localize `Game Profiler`);
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
