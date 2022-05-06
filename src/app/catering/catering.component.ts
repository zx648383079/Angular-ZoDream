import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginDialogComponent } from '../auth/login/dialog/login-dialog.component';
import { IMenuButton, IMenuItem } from '../context-menu';
import { DialogAnimation } from '../theme/constants/dialog-animation';
import { AppState } from '../theme/interfaces';
import { IUser } from '../theme/models/user';
import { getCurrentUser } from '../theme/reducers/auth.selectors';
import { AuthService } from '../theme/services';
import { CartDialogComponent } from './cart/dialog/cart-dialog.component';

@Component({
    selector: 'app-catering',
    templateUrl: './catering.component.html',
    styleUrls: ['./catering.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class CateringComponent implements OnInit {

    @ViewChild(LoginDialogComponent)
    public loginModal: LoginDialogComponent;
    @ViewChild(CartDialogComponent)
    public cartModal: CartDialogComponent;

    public tabIndex = 0;
    public user: IUser;
    public authOpen = false;
    public searchOpen = false;
    public menuItems: IMenuItem[] = [
        {
            name: '个人中心',
            data: 'member',
        },
        {
            name: '我的地址',
            data: 'member/address',
        },
        {
            name: '我的订单',
            data: 'member/order',
        },
        {
            name: '服务员中心',
            children: [
                {
                    name: '订单管理',
                    data: 'waiter/order',
                },
                {
                    name: '记录管理',
                    data: 'waiter/log',
                },
            ]
        },
        {
            name: '商家中心',
            children: [
                {
                    name: '订单管理',
                    data: 'merchant/order',
                },
                {
                    name: '商品管理',
                    data: 'merchant/goods',
                },
                {
                    name: '员工管理',
                    data: 'merchant/staff',
                },
                {
                    name: '库存管理',
                    data: 'merchant/stock',
                },
            ]
        },
        {},
        {
            icon: 'icon-sign-out',
            name: '退出',
            onTapped: () => {
                this.authService.logout().subscribe();
            }
        }
    ];

    constructor(private store: Store<AppState>,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user ? user : {avatar: 'assets/images/avatar/0.png'} as any;
        });
    }

    @HostListener('touchstart', ['$event.targetTouches'])
    onTouchStart(touches: TouchList) {
        // touches[0];
    }

    @HostListener('touchend', ['$event.changedTouches'])
    onTouchEnd(touches: TouchList) {
        
    }

    ngOnInit() {
    }

    public tapTab(i: number) {
        this.tabIndex = i;
    }

    public tapSearch() {
        this.searchOpen = true;
    }

    public tapAvatar() {
        if (this.user.id) {
            this.authOpen = !this.authOpen;
            return;
        }
        this.loginModal.open();
    }

    public onMenuTap(e: IMenuButton) {
        this.authOpen = false;
        if (e.onTapped) {
            return;
        }
        if (e.data) {
            this.router.navigate([e.data], {relativeTo: this.route});
        }
    }

}
