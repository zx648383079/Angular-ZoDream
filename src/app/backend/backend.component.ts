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
import { LegworkBackendMenu } from '../legwork/backend/menu';
import { VideoBackendMenu } from './video/menu';
import { ShopBackendMenu } from '../shop/backend/menu';
import { BlogBackendMenu } from '../blog/backend/menu';
import { BookBackendMenu } from '../book/backend/menu';
import { ForumBackendMenu } from '../forum/backend/menu';
import { OnlineServiceBackendMenu } from '../online-service/backend/menu';

@Component({
    selector: 'app-backend',
    templateUrl: './backend.component.html',
    styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnInit {

    public navItems: INav[] = [{
            name: '首页',
            icon: 'icon-home',
            url: './'
        },
        {
            name: '我的',
            icon: 'icon-user',
            url: './user/profile',
            children: [{
                    name: '消息',
                    label: '消',
                    url: './user/bulletin'
                },
                {
                    name: '账户关联',
                    label: '联',
                    url: './user/connect'
                },
                {
                    name: '操作记录',
                    label: '操',
                    url: './user/log'
                },
                {
                    name: '登录记录',
                    label: '登',
                    url: './user/login-log'
                },
                {
                    name: '修改密码',
                    label: '密',
                    url: './user/password'
                }
            ]
        },
        {
            name: '会员管理',
            icon: 'icon-group',
            url: './auth',
            children: [{
                    name: '会户列表',
                    label: '会',
                    url: './auth/users'
                },
                {
                    name: '角色权限',
                    label: '角',
                    url: './auth/role'
                },
                {
                    name: '第三方管理',
                    label: '三',
                    url: './auth/oauth'
                },
                {
                    name: '账户申请日志',
                    label: '申',
                    url: './auth/users/apply/log'
                },
                {
                    name: '账户日志',
                    label: '账',
                    url: './auth/users/account/log'
                },
                {
                    name: '会员操作日志',
                    label: '操',
                    url: './auth/users/action/log'
                },
                {
                    name: '管理员日志',
                    label: '管',
                    url: './auth/admin/log'
                },
            ]
        },
        ...BlogBackendMenu,
        ...ShopBackendMenu,
        ...ForumBackendMenu,
        ...BookBackendMenu,
        ...VideoBackendMenu,
        ...LegworkBackendMenu,
        ...OnlineServiceBackendMenu,
        {
            name: '开放平台',
            icon: 'icon-th-large',
            url: './open',
            children: [{
                    name: '应用管理',
                    label: '应',
                    url: './open/platform',
                },
                {
                    name: '授权管理',
                    label: '授',
                    url: './open/authorize',
                },
            ],
        },
        {
            name: '短信管理',
            icon: 'icon-mail',
            url: './sms',
            children: [{
                    name: '签名管理',
                    label: '签',
                    url: './sms/signature',
                },
                {
                    name: '模板管理',
                    label: '模',
                    url: './sms/template',
                },
                {
                    name: '记录管理',
                    label: '录',
                    url: './sms/log',
                },
                {
                    name: '短信配置',
                    label: '置',
                    url: './sms/option',
                },
            ],
        },
        {
            name: '系统设置',
            icon: 'icon-cog',
            url: './system',
            children: [{
                    name: '反馈留言',
                    label: '馈',
                    url: './contact/feedback',
                },
                {
                    name: '友情链接',
                    label: '链',
                    url: './contact/friend-link',
                },
                {
                    name: '订阅',
                    label: '订',
                    url: './contact/subscribe',
                },
                {
                    name: '缓存',
                    label: '缓',
                    url: './system/cache',
                },
                {
                    name: 'SiteMap',
                    label: 'Map',
                    url: './system/sitemap',
                },
                {
                    name: '数据备份',
                    label: '备',
                    url: './system/sql',
                },
            ]
        }
    ];

    public bottomNavs: INav[] = [{
            name: '登录',
            icon: 'icon-user',
            url: './user/profile'
        },
        {
            name: '设置',
            icon: 'icon-cog',
            url: './system'
        }
    ];

    constructor(
        private store: Store<AppState>,
        private actions: AuthActions,
        private service: BackendService) {
        this.store.select(getCurrentUser).subscribe(user => {
            if (!user) {
                return;
            }
            this.bottomNavs[0].name = user.name;
        });
        // 订阅 roles 变化
        this.store.select(getUserRole).subscribe(roles => {
            this.navItems = this.service.filterNavByRole(this.navItems, roles);
            this.bottomNavs = this.service.filterNavByRole(this.bottomNavs, roles);
        });
        this.service.roles().subscribe(res => {
            // 设置 roles
            this.store.dispatch(this.actions.setRole(res.permissions));
        });
    }

    ngOnInit(): void {}

}
