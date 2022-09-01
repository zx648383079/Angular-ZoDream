import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { IUser } from '../../theme/models/user';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    public user: IUser;

    constructor(
        private store: Store<AppState>,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
    }

}
