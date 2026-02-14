import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../../components/dialog';
import { CountdownEvent } from '../../../../components/form';
import { AppState } from '../../../../theme/interfaces';
import { IUser } from '../../../../theme/models/user';
import { selectAuthUser } from '../../../../theme/reducers/auth.selectors';
import { emptyValidate } from '../../../../theme/validators';
import { MemberService } from '../member.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-member-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss']
})
export class PasswordComponent {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly service = inject(MemberService);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly tabIndex = signal(0);
    public user: IUser;
    public readonly stepIndex = signal(0);
    public readonly dataForm = form(signal({
        old_password: '',
        password: '',
        confirm_password: '',
        verify_code: '',
        verify: '',
    }));

    constructor() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user;
        });
    }

    public tapBack() {
        if (this.tabIndex() > 0) {
            this.tabIndex.set(0);
            return;
        }
        this.location.back();
    }

    public tapSendCode(e: CountdownEvent) {
        // 获取新的验证码
        this.service.sendCode({
            to_type: this.tabIndex() === 1 ? 'email' : 'mobile',
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
        if (this.tabIndex() < 1) {
            // 验证验证码
            this.verifyRole();
            return;
        }
        if (this.stepIndex() == 1) {
            //
            this.service.passwordUpdate({
                verify_type: '',
                verify: '',
                password: '',
                confirm_password: '',
            }).subscribe({
                next: res => {
                    this.stepIndex.set(2);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }
    }

    private verifyRole() {
        if (emptyValidate(this.dataForm.verify_code().value())) {
            this.toastrService.warning($localize `Please enter the verification code`);
            return;
        }
        this.service.verifyCode({
            to_type: this.dataForm.verify().value() as any,
            code: this.dataForm.verify_code().value(),
            event: 'verify_old',
        }).subscribe({
            next: _ => {
                this.stepIndex.set(1);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }
}
