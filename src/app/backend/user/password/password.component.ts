import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { UserService } from '../user.service';
import { confirmValidator } from '../../../components/desktop/directives';

@Component({
    standalone: false,
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss']
})
export class PasswordComponent {

    public form = this.fb.group({
        old_password: ['', Validators.required],
        password: ['', Validators.required],
        confirm_password: ['', Validators.required],
    }, {
        validators: confirmValidator()
    });

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private service: UserService,
        private toastrService: DialogService) { }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        e?.enter();
        this.service.passwordUpdate(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success('密码修改成功');
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

}
