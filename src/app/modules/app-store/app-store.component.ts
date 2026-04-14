import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { IUser } from '../../theme/models/user';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { AppStoreService } from './app-store.service';
import { ICategory } from './model';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-app-store',
    templateUrl: './app-store.component.html',
    styleUrls: ['./app-store.component.scss']
})
export class AppStoreComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly service = inject(AppStoreService);

    public readonly queries = form(signal({
        keywords: '',
    }));

    public readonly navItems = signal<ICategory[]>([
        {name: '推荐'} as any,
    ]);
    public readonly navIndex = signal(0);
    public readonly user = signal<IUser|null>(null);
    public readonly searchVisible = signal(false);
    public readonly navOpen =  signal(false);

    public readonly subNavItems = computed<ICategory[]>(() => {
        return this.navItems()[this.navIndex()].children ?? [];
    });

    constructor() {
        this.searchVisible.set(window.location.pathname.indexOf('category') > 0);
        this.store.select(selectAuthUser).subscribe(user => {
            this.user.set(user);
        });
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.searchVisible.set(event.url.indexOf('category') > 0);
            }
        }); 
        this.service.batch({
            categories: {},
            recommend: {}
        }).subscribe(res => {
            this.navItems.update(v => {
                v[0].children = res.recommend || [];
                return [v[0], ...(res.categories ?? [])]
            });
        });
    }


    public tapSearch(e: Event) {
        e.preventDefault();
        this.router.navigate(['search'], {relativeTo: this.route, queryParams: this.queries().value()});
    }

    public toggleNav() {
        this.navOpen.update(v => !v);
    }

}
