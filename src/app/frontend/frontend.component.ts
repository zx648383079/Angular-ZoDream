import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FrontendService } from './frontend.service';
import { ILink } from '../theme/models/seo';
import { Store } from '@ngrx/store';
import { AppState } from '../theme/interfaces';
import { getUserProfile } from '../theme/reducers/auth.selectors';
import { IUser, IUserStatus } from '../theme/models/user';
import { AuthService, SearchService } from '../theme/services';
import { DialogService } from '../components/dialog';
import { LoginDialogComponent } from '../modules/auth/login/dialog/login-dialog.component';
import { SearchEvents } from '../theme/models/event';

interface IMenuItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.scss']
})
export class FrontendComponent implements OnDestroy {

    @ViewChild(LoginDialogComponent)
    private loginModal: LoginDialogComponent;

    public menus: IMenuItem[] = [
        {name: $localize `Home`, url: '../'},
        {name: $localize `Blog`, url: 'blog'},
        {name: $localize `Friend Link`, url: 'friend_link'},
        {name: $localize `Abount`, url: 'about'}
    ];

    public friendLinks: ILink[] = [];
    public navExpand = false;
    public fixedTop = false;
    public navStyle = true;
    public activeUri = '';
    public user: IUserStatus;
    public userLoading = false;
    public dropDownVisiable = false;

    constructor(
        private service: FrontendService,
        private router: Router,
        private store: Store<AppState>,
        private authService: AuthService,
        private toastrService: DialogService,
        private searchService: SearchService,
    ) {
        this.store.select(getUserProfile).subscribe(res => {
            this.userLoading = res.isLoading;
            this.user = res.user as any;
            if (!res.isLoading && res.user) {
                this.authService.loadProfile('bulletin_count,today_checkin').subscribe(profile => {
                    this.user = profile;
                });
            }
        });
        this.service.friendLinks().subscribe(res => {
            this.friendLinks = res;
        });
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.routerChanged(event.url);
            }
        });
        this.searchService.on(SearchEvents.LOGIN, () => {
            this.loginModal.open();
        });
        this.searchService.on('navbar', res => {
            this.navStyle = res;
        });
    }

    public get locationHref() {
        return window.location.href;
    }

    ngOnDestroy(): void {
        this.searchService.off(SearchEvents.LOGIN, 'navbar');
    }

    public onCheckedChange(checked: boolean) {
        if (this.user) {
            this.user.today_checkin = checked;
        }
    }

    public toggleDropDown() {
        this.dropDownVisiable = !this.dropDownVisiable;
    }

    public tapLogin() {
        this.router.navigate(['/auth'], {queryParams: {redirect_uri: this.locationHref}});
        // this.searchService.emitLogin(true);
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
