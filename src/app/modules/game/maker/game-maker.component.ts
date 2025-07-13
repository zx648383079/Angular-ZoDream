import { Component, OnDestroy } from '@angular/core';
import { ThemeService } from '../../../theme/services';
import { INavLink } from '../../../theme/models/seo';
import { Store } from '@ngrx/store';
import { AppState } from '../../../theme/interfaces';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-game-maker',
    templateUrl: './game-maker.component.html',
    styleUrls: ['./game-maker.component.scss']
})
export class GameMakerComponent implements OnDestroy {

    public navItems: INavLink[] = [
        {
            name: $localize `Home`,
            icon: 'icon-home',
            url: './'
        },
        {
            name: $localize `Character`,
            icon: 'icon-th-large',
            url: './character'
        },
        {
            name: $localize `Indigenous`,
            icon: 'icon-search',
            url: './indigenous'
        },
        {
            name: $localize `Items`,
            icon: 'icon-gift',
            url: './item'
        },
        {
            name: $localize `Maps`,
            icon: 'icon-globe',
            url: './map/area'
        },
        {
            name: $localize `Task`,
            icon: 'icon-th-list',
            url: './task'
        },
        {
            name: $localize `Rule Manage`,
            icon: 'icon-cog',
            children: [
                {
                    name: $localize `Descent`,
                    url: './descent'
                },
                {
                    name: $localize `Character Identity`,
                    url: './character/identity'
                },
                {
                    name: $localize `Grade`,
                    url: './rule/grade'
                },
                {
                    name: $localize `Skill`,
                    url: './skill'
                },
                {
                    name: $localize `Checkin`,
                    url: './rule/checkin'
                },
                {
                    name: $localize `Farm`,
                    url: './rule/farm'
                },
                {
                    name: $localize `Ranch`,
                    url: './rule/ranch'
                },
                {
                    name: $localize `Prize`,
                    url: './rule/prize'
                },
                {
                    name: $localize `Store`,
                    url: './rule/store'
                },
                {
                    name: $localize `Achieve`,
                    url: './rule/achieve'
                },
            ]
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
    private subItems: Subscription[] = [];

    constructor(private store: Store<AppState>,
        private themeService: ThemeService,) {
        this.themeService.setTitle($localize `Game Maker`);
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
