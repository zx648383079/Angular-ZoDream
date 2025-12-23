import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { IUser } from '../../theme/models/user';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { ICategory } from './model';
import { ResourceService } from './resource.service';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../theme/services';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-resource-store',
    templateUrl: './resource-store.component.html',
    styleUrls: ['./resource-store.component.scss']
})
export class ResourceStoreComponent implements OnInit, OnDestroy {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly service = inject(ResourceService);
    private readonly themeService = inject(ThemeService);

    public readonly queries = form(signal({
        keywords: '',
    }));


    public navItems: ICategory[] = [
        {name: '推荐'} as any,
    ];
    public navIndex = 0;
    public user: IUser;
    public searchVisible = false;
    public navOpen = false;
    private readonly subItems = new Subscription();

    constructor() {
        this.themeService.titleChanged.next($localize `Resource Store`);
        this.subItems.add(
            this.store.select(selectAuthUser).subscribe(user => {
                this.user = user;
            }),
        );
    }

    public get subNavItems(): ICategory[] {
        return this.navItems[this.navIndex].children;
    }

    ngOnInit() {
        this.searchVisible = window.location.pathname.indexOf('category') > 0;
        this.subItems.add(
            this.router.events.subscribe(event => {
                if (event instanceof NavigationStart) {
                    this.searchVisible = event.url.indexOf('category') > 0;
                }
            })
        );
        this.service.batch({
            categories: {},
            recommend: {}
        }).subscribe(res => {
            this.navItems = [this.navItems[0]].concat(res.categories);
            this.navItems[0].children = res.recommend;
        });
    }

    ngOnDestroy(): void {
        this.subItems.unsubscribe();
    }


    public tapSearch(e: Event) {
        e.preventDefault();
        this.router.navigate(['search'], {relativeTo: this.route, queryParams: this.queries().value()});
    }

    public toggleNav() {
        this.navOpen = !this.navOpen;
    }

}
