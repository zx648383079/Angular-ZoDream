import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { IUser } from '../../theme/models/user';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';
import { UserService } from './user.service';
import { MenuService } from './menu.service';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { INav } from '../../theme/components';
import { SearchService } from '../../theme/services';
import { SearchEvents } from '../../theme/models/event';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

    public user: IUser;
    public tabItems: INav[] = [];
    public moreItems: INav[] = [];
    public moreVisible = false;
    public navToggle = true;

    constructor(
        private store: Store<AppState>,
        private service: UserService,
        private router: Router,
        private menuService: MenuService,
        private searchService: SearchService,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user;
        });
        this.menuService.change$.subscribe(res => {
            this.tabItems = res.tab;
            this.moreItems = res.more;
        });
    }

    ngOnInit() {
        this.searchService.on(SearchEvents.NAV_TOGGLE, toggle => {
            setTimeout(() => {
                this.navToggle = toggle === 3;
            }, 100);
        });
        this.menuService.refresh();
        this.service.profile().subscribe(res => {
            this.user = res;
        });
        this.router.events.subscribe((event: NavigationEnd) => {
            if (event instanceof ActivationEnd) {// 当导航成功结束时执行
                this.menuService.refresh();
            }
        });
    }

    ngOnDestroy() {
        // this.searchService.off(SearchEvents.NAV_TOGGLE);
    }

}
