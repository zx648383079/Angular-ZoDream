import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
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
export class BackendComponent implements OnDestroy {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly actions = inject(AuthActions);
    private readonly service = inject(BackendService);
    private readonly toastrService = inject(DialogService);
    private readonly menuService = inject(MenuService);
    private readonly themeService = inject(ThemeService);


    public readonly navItems = signal<INavLink[]>([]);
    public readonly bottomNavs = signal<INavLink[]>([]);
    private readonly subItems = new Subscription();

    constructor() {
        this.themeService.titleChanged.next('管理平台');
        this.menuService.change$.subscribe(res => {
            this.navItems.set(res.items);
            this.bottomNavs.set(res.bottom);
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
    ngOnDestroy(): void {
        this.subItems.unsubscribe();
    }
}
