import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IMenuItem } from '../context-menu';
import { DialogAnimation } from '../theme/constants/dialog-animation';
import { AppState } from '../theme/interfaces';
import { IUser } from '../theme/models/user';
import { getCurrentUser } from '../theme/reducers/auth.selectors';

@Component({
    selector: 'app-catering',
    templateUrl: './catering.component.html',
    styleUrls: ['./catering.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class CateringComponent implements OnInit {

    public dialogOpen = false;
    public tabIndex = 0;
    public user: IUser;
    public authOpen = false;
    public searchOpen = false;
    public menuItems: IMenuItem[] = [
        {
            name: '个人中心',
        },
        {
            name: '我的订单',
        },
        {
            name: '商家中心',
            children: [
                {
                    name: '订单管理'
                },
                {
                    name: '商品管理'
                },
                {
                    name: '员工管理'
                },
                {
                    name: '库存管理'
                },
            ]
        },
        {},
        {
            icon: 'icon-sign-out',
            name: '退出'
        }
    ];

    constructor(private store: Store<AppState>) {
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
        this.dialogOpen = true;
    }

}
