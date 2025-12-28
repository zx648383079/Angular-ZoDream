import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
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


    public readonly navItems = signal<ICategory[]>([
        {name: '推荐'} as any,
    ]);
    public readonly navIndex = signal(0);
    public readonly user = signal<IUser>(null);
    public readonly searchVisible = signal(false);
    public readonly navOpen = signal(false);
    private readonly subItems = new Subscription();

    constructor() {
        this.themeService.titleChanged.next($localize `Resource Store`);
        this.subItems.add(
            this.store.select(selectAuthUser).subscribe(user => {
                this.user.set(user);
            }),
        );
    }

    public readonly subNavItems = computed(() => {
        return this.navItems[this.navIndex()]?.children ?? [];
    });

    ngOnInit() {
        this.searchVisible.set(window.location.pathname.indexOf('category') > 0);
        this.subItems.add(
            this.router.events.subscribe(event => {
                if (event instanceof NavigationStart) {
                    this.searchVisible.set(event.url.indexOf('category') > 0);
                }
            })
        );
        this.service.batch({
            categories: {},
            recommend: {}
        }).subscribe(res => {
            this.navItems.update(v => {
                v[0].children = res.recommend;
                return [v[0], ...res.categories];
            });
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
        this.navOpen.update(v => !v);
    }

}
