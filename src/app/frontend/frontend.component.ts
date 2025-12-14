import { Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
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
import { debounceTime, Subscription } from 'rxjs';
import { selectSystemConfig } from '../theme/reducers/system.selectors';
import { NavigationDisplayMode } from '../theme/models/event';

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
export class FrontendComponent implements OnDestroy {
    private readonly service = inject(FrontendService);
    private readonly router = inject(Router);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly authService = inject(AuthService);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    private readonly loginModal = viewChild(LoginDialogComponent);

    public menus: IMenuItem[] = [
        {name: $localize `Home`, url: '../'},
        {name: $localize `Blog`, url: 'blog'},
        {name: $localize `Friend Link`, url: 'friend_link'},
        {name: $localize `Abount`, url: 'about'}
    ];

    public friendLinks: ILink[] = [];
    public navExpand = false;
    public fixedTop = false;
    public diplayMode = NavigationDisplayMode.Inline;
    public navStyle = true;
    public activeUri = '';
    public site: ISystemOption = {} as any;
    public user: IUserStatus;
    public userLoading = false;
    public dropDownVisible = false;
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
    private subItems = new Subscription();

    constructor() {
        this.subItems.add(
            this.store.select(selectAuth).subscribe(res => {
                if (this.userLoading === res.isLoading && !this.user === res.guest) {
                    return;
                }
                this.userLoading = res.isLoading;
                this.user = res.guest ?  undefined : {...res.user} as any;
                if (!res.isLoading && !res.guest) {
                    this.authService.loadProfile('bulletin_count,today_checkin,post_count,follower_count,following_count').subscribe(profile => {
                        this.user = {...profile};
                        this.dropNavItems[1].count = profile.bulletin_count;
                        this.dropNavItems.forEach(i => {
                            if (i.is_access) {
                                i.hidden = !profile.is_admin;
                            }
                        });
                    });
                }
            }),
        );
        this.subItems.add(this.store.select(selectSystemConfig).subscribe(res => {
                this.site = {...res};
                if (this.site.site_pns_beian) {
                    this.site.site_pns_beian_no = this.site.site_pns_beian.match(/\d+/).toString();
                }
            }),
        );
        this.subItems.add(this.themeService.loginRequest.subscribe(() => {
                this.loginModal().open();
            }),
        );
        this.subItems.add(this.themeService.navigationDisplayRequest.pipe(debounceTime(100)).subscribe(toggle => {
                this.diplayMode = toggle;
                this.themeService.navigationChanged.next({
                    mode: toggle,
                    paneWidth: 0,
                    bodyWidth: this.themeService.bodyWidth
                });
            })
        );
        this.service.friendLinks().subscribe(res => {
            this.friendLinks = res;
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

    public get todayChecked(): boolean {
        return this.user && this.user.today_checkin;
    }

    ngOnDestroy(): void {
        this.subItems.unsubscribe();
    }

    public onCheckedChange(checked: boolean) {
        if (this.user) {
            this.user.today_checkin = checked;
        }
    }

    public toggleDropDown() {
        this.dropDownVisible = !this.dropDownVisible;
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
