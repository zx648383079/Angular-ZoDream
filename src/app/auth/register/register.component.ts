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
    confirmValidator
} from '../../theme/validators';
import {
    IErrorResponse
} from '../../theme/models/page';
import {
    AuthService
} from '../../theme/services';
import { DialogService } from '../../dialog';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    public isObserve = false;

    public registerForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, passwordValidator]],
        confirm_password: ['', [Validators.required]],
        agree: [false, Validators.requiredTrue]
    }, {
        validators: confirmValidator()
    });

    constructor(
        private fb: FormBuilder,
        private toastrService: DialogService,
        private authService: AuthService
    ) {}

    ngOnInit() {}

    get email() {
        return this.registerForm.get('email');
    }

    get password() {
        return this.registerForm.get('password');
    }

    public tapSignUp() {
        if (!this.registerForm.valid) {
            return;
        }
        this.authService
            .register(Object.assign({}, this.registerForm.value)).subscribe({
                error: err => {
                    const res = err.error as IErrorResponse;
                    this.toastrService.warning(res.message);
                }
            });
    }

}
