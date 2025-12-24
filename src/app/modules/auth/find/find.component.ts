import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IErrorResponse } from '../../../theme/models/page';
import { AuthService, ThemeService } from '../../../theme/services';
import { DialogService } from '../../../components/dialog';
import { email, form, required, validate } from '@angular/forms/signals';
import { emptyValidate } from '../../../theme/validators';

@Component({
    standalone: false,
    selector: 'app-auth-find',
    templateUrl: './find.component.html',
    styleUrls: ['./find.component.scss']
})
export class FindComponent {
    private readonly service = inject(AuthService);
    private readonly toastrService = inject(DialogService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly themeService = inject(ThemeService);


    public readonly sended = signal(false);
    public isObserve = false;

    public readonly dataModel = signal({
        email: '',
        code: '',
        password: '',
        confirm_password: ''
    });

    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.email, {message: 'Email is required'});
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
            if (this.sended() && emptyValidate(value())) {
                return {
                    kind: 'requiredIf',
                    message: $localize `Please input the security code!`
                }
            }
            return null;
        });
        validate(schemaPath.password, ({value}) => {
            if (this.sended() && value().length > 6) {
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

    public readonly btnLabel = computed(() => {
        return this.sended ? $localize `Reset Password ` : $localize `Send verification email`;
    });

    public tapSubmit(e: Event) {
        e.preventDefault();
        if (!this.sended) {
            this.service.sendFindEmail(this.dataForm.email().value()).subscribe({
                next: res => {
                    this.toastrService.success(res.message);
                    this.sended.set(true);
                }, error: err => {
                    const res = err.error as IErrorResponse;
                    this.toastrService.warning(res.message);
                }
            });
            return;
        }
        const data = Object.assign({}, this.dataForm().value());
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
