import { Component, DestroyRef, inject, signal } from '@angular/core';
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
import { INavLink } from '../theme/models/seo';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-backend',
    templateUrl: './backend.component.html',
    styleUrls: ['./backend.component.scss']
})
export class BackendComponent {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly actions = inject(AuthActions);
    private readonly destroyRef = inject(DestroyRef);
    private readonly service = inject(BackendService);
    private readonly toastrService = inject(DialogService);
    private readonly menuService = inject(MenuService);
    private readonly themeService = inject(ThemeService);


    public readonly navItems = signal<INavLink[]>([]);
    public readonly bottomNavs = signal<INavLink[]>([]);

    constructor() {
        this.themeService.titleChanged.next('管理平台');
        this.menuService.change$.subscribe(res => {
            this.navItems.set(res.items);
            this.bottomNavs.set(res.bottom);
        });
        this.store.select(selectAuthUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
            this.menuService.setUser(user);
        });
        // 订阅 roles 变化
        this.store.select(selectAuthRole).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(roles => {
            this.menuService.setRole(roles);
        });
        this.service.roles().subscribe(res => {
            // 设置 roles
            this.store.dispatch(this.actions.setRole(res.permissions));
            if (res.role) {
                this.toastrService.success('欢迎您！' + res.role.display_name);
            }
        });
    }
}
