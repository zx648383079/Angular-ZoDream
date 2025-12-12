import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IErrorResponse } from '../../../theme/models/page';
import { AuthService, ThemeService } from '../../../theme/services';
import { DialogService } from '../../../components/dialog';
import { email, form, validate } from '@angular/forms/signals';
import { emptyValidate } from '../../../theme/validators';

@Component({
    standalone: false,
    selector: 'app-auth-find',
    templateUrl: './find.component.html',
    styleUrls: ['./find.component.scss']
})
export class FindComponent {
    private service = inject(AuthService);
    private toastrService = inject(DialogService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private themeService = inject(ThemeService);


    public sended = false;
    public isObserve = false;

    public findModel = signal({
        email: '',
        code: '',
        password: '',
        confirm_password: ''
    });

    public findForm = form(this.findModel, schemaPath => {
        email(schemaPath.email, {message: 'Please enter a valid email address'});
        validate(schemaPath.confirm_password, ({value, valueOf}) => {
            if (value() !== valueOf(schemaPath.password)) {
                return {
                    kind: 'sameOf',
                    message: '两次秘密比一致'
                }
            }
            return null;
        });
        validate(schemaPath.code, ({value}) => {
            if (this.sended && emptyValidate(value())) {
                return {
                    kind: 'requiredIf',
                    message: $localize `Please input the security code!`
                }
            }
            return null;
        });
        validate(schemaPath.password, ({value}) => {
            if (this.sended && value().length > 6) {
                return {
                    kind: 'requiredIf',
                    message: $localize `Password must be at least 6 characters`
                }
            }
            return null;
        });
    });

    constructor() {
        this.themeService.titleChanged.next($localize `Retrieve password`);
    }

    get btnLabel() {
        return this.sended ? $localize `Reset Password ` : $localize `Send verification email`;
    }

    public tapSubmit() {
        if (!this.sended) {
            this.service.sendFindEmail(this.findForm.email().value()).subscribe({
                next: res => {
                    this.toastrService.success(res.message);
                    this.sended = true;
                }, error: err => {
                    const res = err.error as IErrorResponse;
                    this.toastrService.warning(res.message);
                }
            });
            return;
        }
        const data = Object.assign({}, this.findForm().value());
        this.service.resetPassword(data).subscribe({
            next: _ => {
                this.toastrService.success($localize `Successfully retrieve the password`);
                this.router.navigate(['../'], {relativeTo: this.route});
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }
}
