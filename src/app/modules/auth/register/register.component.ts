import { Component, OnDestroy, inject, signal } from '@angular/core';
import {
    emptyValidate
} from '../../../theme/validators';
import {
    IErrorResponse
} from '../../../theme/models/page';
import {
    AuthService, ThemeService
} from '../../../theme/services';
import { DialogService } from '../../../components/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '../../../theme/interfaces';
import { selectSystemConfig } from '../../../theme/reducers/system.selectors';
import { parseNumber } from '../../../theme/utils';
import { Subscription } from 'rxjs';
import { EncryptorService } from '../../../theme/services/encryptor.service';
import { email, form, minLength, required, validate } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-auth-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
    private readonly toastrService = inject(DialogService);
    private readonly authService = inject(AuthService);
    private readonly themeService = inject(ThemeService);
    private encryptor = inject(EncryptorService);
    private readonly store = inject<Store<AppState>>(Store);


    public isObserve = false;
    public openStatus = 0;

    public registerModel = signal({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        invite_code: '',
        agree: false
    });
    public registerForm = form(this.registerModel, schemaPath => {
        required(schemaPath.name, {message: 'Name is required'});
        // required(schemaPath.email, {message: 'Email is required'});
        email(schemaPath.email, {message: 'Please enter a valid email address'});
        // required(schemaPath.password, {message: 'Email is required'});
        minLength(schemaPath.password, 6, {message: 'Password must be at least 6 characters'});
        required(schemaPath.agree, {message: 'Agreement is required'});
        validate(schemaPath.confirm_password, ({value, valueOf}) => {
            if (value() !== valueOf(schemaPath.password)) {
                return {
                    kind: 'sameOf',
                    message: '两次秘密比一致'
                }
            }
            return null;
        });
        validate(schemaPath.invite_code, ({value}) => {
            if (this.openStatus == 1 && emptyValidate(value())) {
                return {
                    kind: 'requiredIf',
                    message: $localize `Please input your invitation code!`
                }
            }
            return null;
        });
    });
    private readonly subItems = new Subscription();

    constructor() {
        this.themeService.titleChanged.next($localize `Sign up`);
        this.subItems.add(
            this.store.select(selectSystemConfig).subscribe(res => {
                this.openStatus = parseNumber(res.auth_register);
            })
        );
    }

    ngOnDestroy() {
        this.subItems.unsubscribe();
    }

    public tapSubmit() {
        if (this.openStatus == 2) {
            this.toastrService.error($localize `Sorry, membership registration is closed, opening hours are undecided!`);
            return;
        }
        if (this.registerForm().invalid()) {
            return;
        }
        const data = Object.assign({}, this.registerForm().value());
        this.authService
            .register({
                ...data,
                password: this.encryptor.encrypt(data.password),
                confirm_password: this.encryptor.encrypt(data.confirm_password)
            }).subscribe({
                error: err => {
                    const res = err.error as IErrorResponse;
                    this.toastrService.warning(res.message);
                }
            });
    }

}
