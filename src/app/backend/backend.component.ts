import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
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

    public navItems: INavLink[] = [];
    public bottomNavs: INavLink[] = [];
    private subItems: Subscription[] = [];

    constructor(
        private store: Store<AppState>,
        private actions: AuthActions,
        private service: BackendService,
        private toastrService: DialogService,
        private menuService: MenuService,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle('管理平台');
        this.menuService.change$.subscribe(res => {
            this.navItems = res.items;
            this.bottomNavs = res.bottom;
        });
        this.subItems.push(this.store.select(selectAuthUser).subscribe(user => {
            this.menuService.setUser(user);
        }));
        // 订阅 roles 变化
        this.subItems.push(this.store.select(selectAuthRole).subscribe(roles => {
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
        for (const item of this.subItems) {
            item.unsubscribe();
        }
    }
}
