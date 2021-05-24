import {
    Component,
    OnInit
} from '@angular/core';
import {
    INav
} from '../theme/components';
import {
    AppState
} from '../theme/interfaces';
import {
    Store
} from '@ngrx/store';
import {
    getCurrentUser,
    getUserRole
} from '../theme/reducers/auth.selectors';
import {
    BackendService
} from './backend.service';
import { AuthActions } from '../theme/actions';
import { backendBottomMenu, backendMenuItems } from './menu';
import { DialogService } from '../dialog';
import { MenuService } from './menu.service';

@Component({
    selector: 'app-backend',
    templateUrl: './backend.component.html',
    styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnInit {

    public navItems: INav[] = [];

    public bottomNavs: INav[] = [];



    constructor(
        private store: Store<AppState>,
        private actions: AuthActions,
        private service: BackendService,
        private toastrService: DialogService,
        private menuService: MenuService,
    ) {
        this.menuService.change$.subscribe(res => {
            this.navItems = res.items;
            this.bottomNavs = res.bottom;
        });
        this.store.select(getCurrentUser).subscribe(user => {
            this.menuService.setUser(user);
        });
        // 订阅 roles 变化
        this.store.select(getUserRole).subscribe(roles => {
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

    ngOnInit(): void {}

}
