import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FrontendService } from './frontend.service';
import { ILink } from '../theme/models/seo';
import { Store } from '@ngrx/store';
import { AppState } from '../theme/interfaces';
import { getCurrentUser } from '../theme/reducers/auth.selectors';
import { IUser } from '../theme/models/user';
import { AuthService } from '../theme/services';
import { DialogService } from '../dialog';

interface IMenuItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.scss']
})
export class FrontendComponent {

    public menus: IMenuItem[] = [
        {name: $localize `Home`, url: '../'},
        {name: $localize `Blog`, url: 'blog'},
        {name: $localize `Friend Link`, url: 'friend_link'},
        {name: $localize `Abount`, url: 'about'}
    ];

    public friendLinks: ILink[] = [];
    public navExpand = false;
    public activeUri = '';
    public user: IUser;
    public dropDownVisiable = false;

    constructor(
        private service: FrontendService,
        private router: Router,
        private store: Store<AppState>,
        private authService: AuthService,
        private toastrService: DialogService,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user;
        });
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

    public toggleDropDown() {
        this.dropDownVisiable = !this.dropDownVisiable;
    }

    public tapLogout() {
        this.toastrService.confirm('确认退出账号？', () => {
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
