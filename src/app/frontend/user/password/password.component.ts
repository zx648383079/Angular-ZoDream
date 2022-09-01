import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CountdownEvent } from '../../../components/form';
import { AppState } from '../../../theme/interfaces';
import { IUser } from '../../../theme/models/user';
import { getCurrentUser } from '../../../theme/reducers/auth.selectors';

@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

    public tabIndex = 0;
    public user: IUser;
    public stepIndex = 0;
    public data = {
        old_password: '',
        password: '',
        confirm_password: '',
        verify_code: '',
        verify: '',
    };

    constructor(
        private store: Store<AppState>,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
    }

    public tapSendCode(e: CountdownEvent) {
        // 获取新的验证码
    }

    public tapNext() {
        if (this.tabIndex < 1) {
            // 验证验证码
            return;
        }
        if (this.stepIndex == 1) {
            //
        }
    }
}
