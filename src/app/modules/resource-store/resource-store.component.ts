import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { IUser } from '../../theme/models/user';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { ICategory } from './model';
import { ResourceService } from './resource.service';
import { ThemeService } from '../../theme/services';
import { form } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-resource-store',
    templateUrl: './resource-store.component.html',
    styleUrls: ['./resource-store.component.scss']
})
export class ResourceStoreComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly service = inject(ResourceService);
    private readonly themeService = inject(ThemeService);
    private readonly destroyRef = inject(DestroyRef);

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

    public readonly subNavItems = signal<any[]>([]);
    public readonly subNavVisible = computed(() => {
        return this.subNavItems().length > 0 || this.searchVisible();
    });

    constructor() {
        this.themeService.titleChanged.next($localize `Resource Store`);
        this.store.select(selectAuthUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
            this.user.set(user);
        });
        this.searchVisible.set(window.location.pathname.indexOf('category') > 0);
        this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
            if (event instanceof NavigationStart) {
                this.searchVisible.set(event.url.indexOf('category') > 0);
            }
        });
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



    public tapSearch(e: Event) {
        e.preventDefault();
        this.router.navigate(['search'], {relativeTo: this.route, queryParams: this.queries().value()});
    }

    public toggleNav() {
        this.navOpen.update(v => !v);
    }

    public tapItem(index: number) {
        this.navIndex.set(index);
        const item = this.navItems()[index];
        this.subNavItems.set(item.children ?? []);
        if (item.children?.length > 0) {
            return;
        }
        this.router.navigate(['category', item.id], {relativeTo: this.route});
    }
}
