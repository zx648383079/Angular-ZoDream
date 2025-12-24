import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { IUserStatus } from '../../theme/models/user';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { MenuService } from './menu.service';
import { ActivationEnd, NavigationEnd, Router, Scroll } from '@angular/router';
import { INavLink } from '../../theme/models/seo';
import { ThemeService } from '../../theme/services';
import { NavigationDisplayMode } from '../../theme/models/event';
import { debounceTime, Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly router = inject(Router);
    private readonly menuService = inject(MenuService);
    private readonly themeService = inject(ThemeService);


    public user: IUserStatus;
    public tabItems: INavLink[] = [];
    public moreItems: INavLink[] = [];
    public moreVisible = false;
    public diplayMode = NavigationDisplayMode.Inline;

    private readonly subItems = new Subscription();

    constructor() {
        this.themeService.titleChanged.next($localize `My`);
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user as any;
        });
        this.menuService.change$.subscribe(res => {
            this.tabItems = res.tab;
            this.moreItems = res.more;
        });
    }

    ngOnInit() {
        this.subItems.add(
            this.themeService.navigationChanged.pipe(debounceTime(100)).subscribe(res => {
                this.diplayMode = res.mode;
            })
        );
        this.subItems.add(this.router.events.subscribe(event => {
                event = event instanceof Scroll ? event.routerEvent : event;
                if (event instanceof NavigationEnd && this.themeService.tabletChanged.value) {
                    this.themeService.navigationDisplayRequest.next(event.url.endsWith('/user/home') || event.url.endsWith('/user') ? NavigationDisplayMode.Inline : NavigationDisplayMode.Collapse);
                }
                if (event instanceof ActivationEnd) {// 当导航成功结束时执行
                    this.menuService.refresh();
                }
            })
        );
        this.menuService.refresh();
    }

    ngOnDestroy() {
        this.subItems.unsubscribe();
    }

}
