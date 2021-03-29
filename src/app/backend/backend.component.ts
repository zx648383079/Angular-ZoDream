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

import { ToastrService } from 'ngx-toastr';
import { backendBottomMenu, backendMenuItems } from './menu';

@Component({
    selector: 'app-backend',
    templateUrl: './backend.component.html',
    styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnInit {

    public navItems: INav[] = [
        {
            name: '首页',
            icon: 'icon-home',
            url: './'
        },
    ];

    public bottomNavs: INav[] = [
        {
            name: '登录',
            icon: 'icon-user',
            url: './user/profile'
        },
    ];



    constructor(
        private store: Store<AppState>,
        private actions: AuthActions,
        private service: BackendService,
        private toastrService: ToastrService,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            if (!user) {
                return;
            }
            this.bottomNavs[0].name = user.name;
        });
        // 订阅 roles 变化
        this.store.select(getUserRole).subscribe(roles => {
            this.navItems = [].concat([this.navItems[0]], this.service.filterNavByRole(backendMenuItems, roles));
            this.bottomNavs = [].concat([this.bottomNavs[0]], this.service.filterNavByRole(backendBottomMenu, roles));
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
