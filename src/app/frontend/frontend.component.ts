import { Component, DestroyRef, computed, inject, signal, viewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FrontendService } from './frontend.service';
import { ILink, ISystemOption } from '../theme/models/seo';
import { Store } from '@ngrx/store';
import { AppState } from '../theme/interfaces';
import { selectAuth } from '../theme/reducers/auth.selectors';
import { IUserStatus } from '../theme/models/user';
import { AuthService, ThemeService } from '../theme/services';
import { DialogService } from '../components/dialog';
import { LoginDialogComponent } from '../modules/auth/login/dialog/login-dialog.component';
import { debounceTime } from 'rxjs';
import { selectSystemConfig } from '../theme/reducers/system.selectors';
import { NavigationDisplayMode } from '../theme/models/event';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface IMenuItem {
  name: string;
  url: string;
}

interface IDropNavItem {
    name?: string;
    url?: string;
    count?: number;
    is_access?: boolean;
    hidden?: boolean;
}

@Component({
    standalone: false,
    selector: 'app-frontend',
    templateUrl: './frontend.component.html',
    styleUrls: ['./frontend.component.scss']
})
export class FrontendComponent {
    private readonly service = inject(FrontendService);
    private readonly router = inject(Router);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly authService = inject(AuthService);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);
    private readonly destroyRef = inject(DestroyRef);


    private readonly loginModal = viewChild(LoginDialogComponent);

    public menus: IMenuItem[] = [
        {name: $localize `Home`, url: '../'},
        {name: $localize `Blog`, url: 'blog'},
        {name: $localize `Friend Link`, url: 'friend_link'},
        {name: $localize `Abount`, url: 'about'}
    ];

    public readonly friendLinks = signal<ILink[]>([]);
    public navExpand = false;
    public fixedTop = false;
    public readonly diplayMode = signal(NavigationDisplayMode.Inline);
    public navStyle = true;
    public activeUri = '';
    public readonly site = signal<ISystemOption>(null);
    public readonly user = signal<IUserStatus>(null);
    public readonly userLoading = signal(false);
    public readonly dropVisible = signal(false);
    public dropNavItems: IDropNavItem[] = [
        {name: $localize `Account`, url: 'user'},
        {name: $localize `Message`, url: 'user/bulletin', count: 0},
        {name: $localize `Profile`, url: 'user/account/profile'},
        {},
        {name: $localize `Help`, url: 'agreement'},
        {name: $localize `Settings`, url: 'user/account/setting'},
        {
            name: $localize `Backend`, url: '/backend',
            hidden: true, is_access: true,
        },
        {}
    ];
    public readonly isGuest = computed(() => this.userLoading() || !this.user());

    constructor() {
        this.store.select(selectAuth).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
            if (this.userLoading() === res.isLoading && !this.user() === res.guest) {
                return;
            }
            this.userLoading.set(res.isLoading);
            this.user.set(res.guest ? null : {...res.user} as any);
            if (!res.isLoading && !res.guest) {
                this.authService.loadProfile('bulletin_count,today_checkin,post_count,follower_count,following_count').subscribe(profile => {
                    this.user.set({...profile});
                    this.dropNavItems[1].count = profile.bulletin_count;
                    this.dropNavItems.forEach(i => {
                        if (i.is_access) {
                            i.hidden = !profile.is_admin;
                        }
                    });
                });
            }
        });
        this.store.select(selectSystemConfig).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
            let site_pns_beian_no = '';
            if (res.site_pns_beian) {
                site_pns_beian_no = res.site_pns_beian.match(/\d+/).toString();
            }
            this.site.set({...res, site_pns_beian_no});
        });
        this.themeService.loginRequest.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.loginModal().open();
        });
        this.themeService.navigationDisplayRequest.pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef)).subscribe(toggle => {
            this.diplayMode.set(toggle);
            this.themeService.navigationChanged.next({
                mode: toggle,
                paneWidth: 0,
                bodyWidth: this.themeService.bodyWidth
            });
        });
        this.service.friendLinks().subscribe(res => {
            this.friendLinks.set(res);
        });
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.routerChanged(event.url);
            }
        });
    }

    public get locationHref() {
        return window.location.href;
    }

    public readonly todayChecked = computed(() => {
        return this.user()?.today_checkin;
    });

    public onCheckedChange(checked: boolean) {
        this.user.update(v => {
            return {...v, today_checkin: checked};
        });
    }

    public toggleDropDown() {
        this.dropVisible.update(v => !v);
    }

    public tapLogin() {
        this.router.navigate(['/auth'], {queryParams: {redirect_uri: this.locationHref}});
        // this.themeService.emitLogin(true);
    }

    public tapLogout() {
        this.toastrService.confirm($localize `Confirm to log out?`, () => {
            this.authService.logout().subscribe(_ => {
            });
        });
    }

    private routerChanged(url: string) {
        this.navExpand = false;
        for (const item of ['about', 'friend_link', 'blog']) {
            if (url.indexOf(item) > 0) {
                this.activeUri = item;
                return;
            }
        }
        this.activeUri = '';
    }

}
