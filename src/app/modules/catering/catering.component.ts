import { Component, HostListener, OnDestroy, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginDialogComponent } from '../auth/login/dialog/login-dialog.component';
import { IMenuButton, IMenuItem } from '../../components/context-menu';
import { AppState } from '../../theme/interfaces';
import { IUser } from '../../theme/models/user';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { AuthService, ThemeService } from '../../theme/services';
import { CartDialogComponent } from './cart/dialog/cart-dialog.component';
import { CateringService } from './catering.service';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-catering',
    templateUrl: './catering.component.html',
    styleUrls: ['./catering.component.scss'],
})
export class CateringComponent implements OnDestroy {
    private readonly service = inject(CateringService);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly authService = inject(AuthService);
    private readonly themeService = inject(ThemeService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);


    public readonly loginModal = viewChild(LoginDialogComponent);
    public readonly cartModal = viewChild(CartDialogComponent);

    public tabIndex = 0;
    public user: IUser;
    public authOpen = false;
    public searchOpen = false;
    public scanOpen = false;
    public menuItems: IMenuItem[] = [];
    private readonly subItems = new Subscription();

    constructor() {
        this.themeService.titleChanged.next($localize `Catering`);
        this.subItems.add(
            this.store.select(selectAuthUser).subscribe(user => {
                const oldUser = this.user;
                this.user = user ? user : {avatar: 'assets/images/avatar/0.png'} as any;
                if (!user) {

                    return;
                }
                if (oldUser?.id === user?.id) {
                    return;
                }
                this.service.batch({
                    profile: {}
                }).subscribe(res => {
                    this.menuItems = this.filterMenu(res.profile.is_waiter, res.profile.has_store);
                });
            })
        );
    }

    @HostListener('touchstart', ['$event.targetTouches'])
    onTouchStart(touches: TouchList) {
        // touches[0];
    }

    @HostListener('touchend', ['$event.changedTouches'])
    onTouchEnd(touches: TouchList) {
        
    }

    ngOnDestroy(): void {
        this.subItems.unsubscribe();
    }

    public tapScan() {
        if (!this.user.id) {
            this.loginModal().open();
            return;
        }
        this.scanOpen = true;
    }

    public onScanCompleted(val: string) {
        this.scanOpen = false;
        console.log(val);
    }

    public tapTab(i: number) {
        this.tabIndex = i;
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.searchOpen = true;
    }

    public tapAvatar() {
        if (this.user.id) {
            this.authOpen = !this.authOpen;
            return;
        }
        this.loginModal().open();
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

    private filterMenu(isWaiter = false, hasStore = false): IMenuItem[] {
        return [
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
            isWaiter ? {
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
            } : undefined,
            hasStore ? {
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
            } : undefined,
            {},
            {
                icon: 'icon-sign-out',
                name: '退出',
                onTapped: () => {
                    this.authService.logout().subscribe();
                }
            }
        ].filter(i => !!i);
    }

}
