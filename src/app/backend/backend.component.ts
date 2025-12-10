import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
    AppState
} from '../theme/interfaces';
import {
    Store
} from '@ngrx/store';
import {
    selectAuthUser,
    selectAuthRole
} from '../theme/reducers/auth.selectors';
import {
    BackendService
} from './backend.service';
import { AuthActions } from '../theme/actions';
import { DialogService } from '../components/dialog';
import { MenuService } from './menu.service';
import { ThemeService } from '../theme/services';
import { Subscription } from 'rxjs';
import { INavLink } from '../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-backend',
    templateUrl: './backend.component.html',
    styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnInit, OnDestroy {
    private store = inject<Store<AppState>>(Store);
    private actions = inject(AuthActions);
    private service = inject(BackendService);
    private toastrService = inject(DialogService);
    private menuService = inject(MenuService);
    private themeService = inject(ThemeService);


    public navItems: INavLink[] = [];
    public bottomNavs: INavLink[] = [];
    private subItems = new Subscription();

    constructor() {
        this.themeService.titleChanged.next('管理平台');
        this.menuService.change$.subscribe(res => {
            this.navItems = res.items;
            this.bottomNavs = res.bottom;
        });
        this.subItems.add(this.store.select(selectAuthUser).subscribe(user => {
            this.menuService.setUser(user);
        }));
        // 订阅 roles 变化
        this.subItems.add(this.store.select(selectAuthRole).subscribe(roles => {
            this.menuService.setRole(roles);
        }));
        this.service.roles().subscribe(res => {
            // 设置 roles
            this.store.dispatch(this.actions.setRole(res.permissions));
            if (res.role) {
                this.toastrService.success('欢迎您！' + res.role.display_name);
            }
        });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.subItems.unsubscribe();
    }
}
