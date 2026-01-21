import { Component, inject, signal } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { UserService } from '../user.service';
import { form, required, validate } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-b-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss']
})
export class PasswordComponent {
    private readonly service = inject(UserService);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        old_password: '',
        password: '',
        confirm_password: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.old_password);
        required(schemaPath.password);
        validate(schemaPath.confirm_password, ({value, valueOf}) => {
            if (value() !== valueOf(schemaPath.password)) {
                return {
                    kind: 'sameOf',
                    message: '两次秘密比一致'
                }
            }
            return null;
        });
    });

    public tapBack() {
        history.back();
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = this.dataForm().value();
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
