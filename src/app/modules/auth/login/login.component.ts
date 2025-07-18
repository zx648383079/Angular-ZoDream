import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import {
    Subscription
} from 'rxjs';
import {
    Store
} from '@ngrx/store';
import {
    AppState
} from '../../../theme/interfaces';
import {
    ActivatedRoute,
    Router
} from '@angular/router';
import {
    AuthService, ThemeService, WebAuthn
} from '../../../theme/services';
import {
    selectAuthStatus
} from '../../../theme/reducers/auth.selectors';
import {
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    emptyValidate
} from '../../../theme/validators';
import {
    apiUri, assetUri
} from '../../../theme/utils';
import {
    IErrorResponse, IErrorResult
} from '../../../theme/models/page';
import { DialogService } from '../../../components/dialog';
import { ButtonEvent, CountdownEvent } from '../../../components/form';
import { selectSystemConfig } from '../../../theme/reducers/system.selectors';
import { EncryptorService } from '../../../theme/services/encryptor.service';
import { passwordValidator } from '../../../components/desktop/directives';

@Component({
    standalone: false,
    selector: 'app-auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    public mode = 0;
    public redirectUri: string;
    public isObserve = false;

    public loginForm = this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required, passwordValidator]],
        code: [''],
        remember: [false],
        captcha: [''],
    });

    public openAuth = false;
    public openWebAuthn = true;
    public twoFaCode = '';
    public recoveryCode = '';
    private captchaToken = '';
    public captchaImage = '';
    private qrToken = '';
    public qrImage = '';
    private subItems: Subscription[] = [];

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private toastrService: DialogService,
        private themeService: ThemeService,
        private authService: AuthService,
        private encryptor: EncryptorService,
        private webAuthn: WebAuthn) {
        this.themeService.titleChanged.next($localize `Sign in`);
        this.subItems.push(
            this.store.select(selectSystemConfig).subscribe(res => {
                this.openAuth = res && res.auth_oauth;
            })
        );
        this.openWebAuthn = this.webAuthn.enabled;
    }

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    get captcha() {
        return this.loginForm.get('captcha');
    }

    public get isRemember() {
        return this.loginForm.get('remember').value;
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.redirectUri = res.redirect_uri || '/';
            this.redirectIfUserLoggedIn();
        });
    }

    ngOnDestroy() {
        for (const item of this.subItems) {
            item.unsubscribe();
        }
    }

    public toggleRemember() {
        this.loginForm.patchValue({
            remember: !this.isRemember
        });
    }

    public tapQr() {
        this.authService.qrRefresh().subscribe({
            next: res => {
                this.qrImage = res.qr;
                this.qrToken = res.token;
                this.mode = 1;
                this.loopCheckQr();
            }, 
            error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    public onAutocomplete(value: string) {
        this.loginForm.patchValue({
            email: value
        });
    }

    private loopCheckQr() {
        if (this.mode < 1 || this.mode > 2) {
            return;
        }
        window.setTimeout(() => {
            this.authService.qrCheck(this.qrToken).subscribe({
                next: _ => {
                    this.mode = 5;
                },
                error: (err: IErrorResult) => {
                    if (err.error.code === 201) {
                        this.loopCheckQr();
                        return;
                    }
                    if (err.error.code === 204) {
                        this.mode = 3;
                        return;
                    }
                    if (err.error.code === 202) {
                        this.mode = 2;
                        this.loopCheckQr();
                        return;
                    }
                    this.mode = 4;
                }
            }
            );
        }, 2000);
    }

    public tapMode(i: number) {
        this.mode = i;
    }

    public tapSignIn(e?: ButtonEvent) {
        if (this.loginForm.invalid) {
            return;
        }
        const data: any = Object.assign({}, this.loginForm.value);
        if (data.password) {
            data.password = this.encryptor.encrypt(data.password);
        }
        if (this.captchaToken) {
            data.captcha_token = this.captchaToken;
        }
        if (this.mode === 8) {
            if (emptyValidate(this.twoFaCode)) {
                this.toastrService.warning($localize `Please input the authentication code`);
                return;
            }
            data.twofa_code = this.twoFaCode;
        } else if (this.mode === 9) {
            if (emptyValidate(this.recoveryCode)) {
                this.toastrService.warning($localize `Please input the recovery code`);
                return;
            }
            data.recovery_code = this.recoveryCode;
        }
        e?.enter();
        this.authService
            .login(data)
            .subscribe({
                error: err => {
                    e?.reset();
                    const res = err.error as IErrorResponse;
                    this.toastrService.warning(res.message);
                    if (res.captcha_token) {
                        this.captchaToken = res.captcha_token;
                    }
                    this.tapCaptcha();
                    if (res.code === 1015) {
                        this.mode = 8;
                    }
                },
                next: () => {
                    e?.reset();
                }
            });
    }


    private redirectIfUserLoggedIn() {
        this.subItems.push(this.store.select(selectAuthStatus).subscribe(
            data => {
                if (!data.guest) {
                    this.router.navigateByUrl(this.redirectUri);
                }
            }
        ));
    }

    public tapOAuth(type: string) {
        if (!this.openAuth) {
            this.toastrService.warning($localize `Third-party login component is closed`);
            return;
        }
        window.location.href = apiUri('auth/oauth', {
            type,
            redirect_uri: window.location.href});
    }

    public focusNext(event: KeyboardEvent) {
        if (event.code !== 'Enter' && event.code !== 'Tab') {
            return;
        }
    }

    public tapCaptcha() {
        if (!this.captchaToken) {
            this.captchaImage = '';
            return;
        }
        this.captchaImage = assetUri('auth/captcha?captcha_token=' + this.captchaToken + '&v=' + Math.random());
    }

    public tapSendCode(event: CountdownEvent) {
        event.start(120);
    }

    public tapWebAuthn() {
        this.webAuthn.get().subscribe({
            next: res => {
                this.authService.setUser(res);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

}
