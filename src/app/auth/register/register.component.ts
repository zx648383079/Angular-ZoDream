import {
    Component,
    OnInit
} from '@angular/core';
import {
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    passwordValidator,
    confirmValidator,
    emptyValidate
} from '../../theme/validators';
import {
    IErrorResponse
} from '../../theme/models/page';
import {
    AuthService, ThemeService
} from '../../theme/services';
import { DialogService } from '../../dialog';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { selectSystemConfig } from '../../theme/reducers/system.selectors';
import { parseNumber } from '../../theme/utils';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

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

    constructor(
        private fb: FormBuilder,
        private toastrService: DialogService,
        private authService: AuthService,
        private themeService: ThemeService,
        private store: Store<AppState>,
    ) {
        this.themeService.setTitle($localize `Sign up`);
        this.store.select(selectSystemConfig).subscribe(res => {
            this.openStatus = parseNumber(res.auth_register);
        });
    }

    ngOnInit() {}

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
            .register(data).subscribe({
                error: err => {
                    const res = err.error as IErrorResponse;
                    this.toastrService.warning(res.message);
                }
            });
    }

}
