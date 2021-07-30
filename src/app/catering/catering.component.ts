import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
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
