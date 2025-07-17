import {
    Component,
    OnDestroy,
} from '@angular/core';
import {
    FormBuilder,
    Validators
} from '@angular/forms';
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
import { confirmValidator, passwordValidator } from '../../../components/desktop/directives';

@Component({
    standalone: false,
    selector: 'app-auth-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {

    public isObserve = false;
    public openStatus = 0;
    public registerForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, passwordValidator]],
        confirm_password: ['', [Validators.required]],
        invite_code: [''],
        agree: [false, Validators.requiredTrue]
    }, {
        validators: confirmValidator()
    });
    private subItems: Subscription[] = [];

    constructor(
        private fb: FormBuilder,
        private toastrService: DialogService,
        private authService: AuthService,
        private themeService: ThemeService,
        private encryptor: EncryptorService,
        private store: Store<AppState>,
    ) {
        this.themeService.titleChanged.next($localize `Sign up`);
        this.subItems.push(
            this.store.select(selectSystemConfig).subscribe(res => {
                this.openStatus = parseNumber(res.auth_register);
            })
        );
    }

    ngOnDestroy() {
        for (const item of this.subItems) {
            item.unsubscribe();
        }
    }

    get email() {
        return this.registerForm.get('email');
    }

    get password() {
        return this.registerForm.get('password');
    }

    public tapSignUp() {
        if (this.openStatus == 2) {
            this.toastrService.error($localize `Sorry, membership registration is closed, opening hours are undecided!`);
            return;
        }
        if (!this.registerForm.valid) {
            return;
        }
        const data = Object.assign({}, this.registerForm.value);
        if (this.openStatus == 1 && emptyValidate(data.invite_code)) {
            this.toastrService.warning($localize `Please input your invitation code!`);
            return;
        }
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
