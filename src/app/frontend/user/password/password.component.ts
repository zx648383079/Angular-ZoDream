import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../components/dialog';
import { CountdownEvent } from '../../../components/form';
import { AppState } from '../../../theme/interfaces';
import { IUser } from '../../../theme/models/user';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';
import { emptyValidate } from '../../../theme/validators';
import { UserService } from '../user.service';

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
        private service: UserService,
        private toastrService: DialogService,
    ) {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
    }

    public tapSendCode(e: CountdownEvent) {
        // 获取新的验证码
        this.service.sendCode({
            to_type: this.tabIndex === 1 ? 'email' : 'mobile',
            event: 'verify_old',
        }).subscribe({
            next: _ => {
                e.start();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapNext() {
        if (this.tabIndex < 1) {
            // 验证验证码
            this.verifyRole();
            return;
        }
        if (this.stepIndex == 1) {
            //
            this.service.passwordUpdate({
                verify_type: '',
                verify: '',
                password: '',
                confirm_password: '',
            }).subscribe({
                next: res => {
                    this.stepIndex = 2;
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }
    }

    private verifyRole() {
        if (emptyValidate(this.data.verify_code)) {
            this.toastrService.warning($localize `Please enter the verification code`);
            return;
        }
        this.service.verifyCode({
            to_type: this.data.verify as any,
            code: this.data.verify_code,
            event: 'verify_old',
        }).subscribe({
            next: _ => {
                this.stepIndex = 1;
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }
}
