import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { IUser } from '../../theme/models/user';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';
import { UserService } from './user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    public user: IUser;

    constructor(
        private store: Store<AppState>,
        private service: UserService
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
        this.service.profile().subscribe(res => {
            this.user = res;
        })
    }

}
