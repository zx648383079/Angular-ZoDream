import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { IUserStatus } from '../../theme/models/user';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { MenuService } from './menu.service';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { INavLink } from '../../theme/models/seo';
import { ThemeService } from '../../theme/services';
import { NavigationDisplayMode } from '../../theme/models/event';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

    public user: IUserStatus;
    public tabItems: INavLink[] = [];
    public moreItems: INavLink[] = [];
    public moreVisible = false;
    public diplayMode = NavigationDisplayMode.Inline;

    private subItems: Subscription[] = [];

    constructor(
        private store: Store<AppState>,
        // private service: UserService,
        private router: Router,
        private menuService: MenuService,
        private themeService: ThemeService,
    ) {
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
        this.subItems.push(
            this.themeService.navigationDisplayRequest.subscribe(toggle => {
                setTimeout(() => {
                    this.diplayMode = toggle;
                }, 1);
            })
        );
        this.menuService.refresh();
        // this.service.profile().subscribe(res => {
        //     this.user = res;
        // });
        this.router.events.subscribe((event: NavigationEnd) => {
            if (event instanceof ActivationEnd) {// 当导航成功结束时执行
                this.menuService.refresh();
            }
        });
    }

    ngOnDestroy() {
        for (const item of this.subItems) {
            item.unsubscribe();
        }
    }

}
