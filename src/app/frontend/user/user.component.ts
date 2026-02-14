import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { IUserStatus } from '../../theme/models/user';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { MenuService } from './menu.service';
import { ActivationEnd, NavigationEnd, Router, Scroll } from '@angular/router';
import { INavLink } from '../../theme/models/seo';
import { ThemeService } from '../../theme/services';
import { NavigationDisplayMode } from '../../theme/models/event';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly router = inject(Router);
    private readonly menuService = inject(MenuService);
    private readonly themeService = inject(ThemeService);
    private readonly destroyRef = inject(DestroyRef);


    public readonly user = signal<IUserStatus>(null);
    public readonly tabItems = signal<INavLink[]>([]);
    public readonly moreItems = signal<INavLink[]>([]);
    public readonly moreVisible = signal(false);
    public readonly diplayMode = signal(NavigationDisplayMode.Inline);

    constructor() {
        this.themeService.titleChanged.next($localize `My`);
        this.store.select(selectAuthUser).subscribe(user => {
            this.user.set(user as any);
        });
        this.menuService.change$.subscribe(res => {
            this.tabItems.set(res.tab);
            this.moreItems.set(res.more);
        });
        this.themeService.navigationChanged.pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef)).subscribe(res => {
            this.diplayMode.set(res.mode);
        });
        this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
            event = event instanceof Scroll ? event.routerEvent : event;
            if (event instanceof NavigationEnd && this.themeService.tabletChanged.value) {
                this.themeService.navigationDisplayRequest.next(event.url.endsWith('/user/home') || event.url.endsWith('/user') ? NavigationDisplayMode.Inline : NavigationDisplayMode.Collapse);
            }
            if (event instanceof ActivationEnd) {// 当导航成功结束时执行
                this.menuService.refresh();
            }
        });
        this.menuService.refresh();
    }


    public toggelMore() {
        this.moreVisible.update(v => !v);
    }
}
