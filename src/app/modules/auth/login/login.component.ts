import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
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
import { email, form, minLength, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);
    private readonly authService = inject(AuthService);
    private readonly encryptor = inject(EncryptorService);
    private readonly webAuthn = inject(WebAuthn);


    public readonly mode = signal(0);
    private redirectUri: string;
    public isObserve = false;

    public dataModel = signal({
        email: '',
        password: '',
        code: '',
        remember: false,
        captcha: '',
        twofa_code: '',
        recovery_code: ''
    });

    public dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.email, {message: 'Email is required'});
        required(schemaPath.password, {message: 'Password is required'});
        email(schemaPath.email, {message: 'Please enter a valid email address'});
        minLength(schemaPath.password, 6, {message: 'Password must be at least 6 characters'});
    });

    public readonly openAuth = signal(false);
    public readonly openWebAuthn = signal(true);
    private captchaToken = '';
    public readonly captchaImage = signal('');
    private qrToken = '';
    public readonly qrImage = signal('');
    private readonly subItems = new Subscription();

    constructor() {
        this.themeService.titleChanged.next($localize `Sign in`);
        this.subItems.add(
            this.store.select(selectSystemConfig).subscribe(res => {
                this.openAuth.set(res && res.auth_oauth);
            })
        );
        this.openWebAuthn.set(this.webAuthn.enabled);
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.redirectUri = res.redirect_uri || '/';
            this.redirectIfUserLoggedIn();
        });
    }

    ngOnDestroy() {
        this.subItems.unsubscribe();
    }

    public tapQr() {
        this.authService.qrRefresh().subscribe({
            next: res => {
                this.qrImage.set(res.qr);
                this.qrToken = res.token;
                this.mode.set(1);
                this.loopCheckQr();
            }, 
            error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    private loopCheckQr() {
        if (this.mode() < 1 || this.mode() > 2) {
            return;
        }
        window.setTimeout(() => {
            this.authService.qrCheck(this.qrToken).subscribe({
                next: _ => {
                    this.mode.set(5);
                },
                error: (err: IErrorResult) => {
                    if (err.error.code === 201) {
                        this.loopCheckQr();
                        return;
                    }
                    if (err.error.code === 204) {
                        this.mode.set(3);
                        return;
                    }
                    if (err.error.code === 202) {
                        this.mode.set(2);
                        this.loopCheckQr();
                        return;
                    }
                    this.mode.set(4);
                }
            }
            );
        }, 2000);
    }

    public tapMode(i: number) {
        this.mode.set(i);
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            return;
        }
        const data: any = this.dataForm().value();
        if (data.password) {
            data.password = this.encryptor.encrypt(data.password);
        }
        if (this.captchaToken) {
            data.captcha_token = this.captchaToken;
        }
        if (this.mode() === 8) {
            if (emptyValidate(data.twofa_code)) {
                this.toastrService.warning($localize `Please input the authentication code`);
                return;
            }
        } else if (this.mode() === 9) {
            if (emptyValidate(data.recovery_code)) {
                this.toastrService.warning($localize `Please input the recovery code`);
                return;
            }
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
                        this.mode.set(8);
                    }
                },
                next: () => {
                    e?.reset();
                }
            });
    }


    private redirectIfUserLoggedIn() {
        this.subItems.add(this.store.select(selectAuthStatus).subscribe(
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
            this.captchaImage.set('');
            return;
        }
        this.captchaImage.set(assetUri('auth/captcha?captcha_token=' + this.captchaToken + '&v=' + Math.random()));
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
