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
} from '../../theme/interfaces';
import {
    ActivatedRoute,
    Router
} from '@angular/router';
import {
    AuthService
} from '../../theme/services';
import {
    getAuthStatus
} from '../../theme/reducers/auth.selectors';
import {
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    passwordValidator
} from '../../theme/validators';
import {
    environment
} from '../../../environments/environment';
import {
    getCurrentTime,
    uriEncode
} from '../../theme/utils';
import {
    Md5
} from 'ts-md5';
import {
    ToastrService
} from 'ngx-toastr';
import {
    IErrorResponse, IErrorResult
} from '../../theme/models/page';
import { CountdownButtonComponent } from '../../theme/components';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    public mode = 0;
    public loginSubs: Subscription;
    public redirectUri: string;
    public isObserve = false;

    public loginForm = this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required, passwordValidator]],
        code: [''],
        remember: [false],
        captcha: [''],
    });

    private captchaToken = '';
    public captchaImage = '';
    private qrToken = '';
    public qrImage = '';

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private toastrService: ToastrService,
        private authService: AuthService) {
        this.redirectIfUserLoggedIn();
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

    public tapQr() {
        this.authService.qrRefresh().subscribe(res => {
            this.qrImage = res.qr;
            this.qrToken = res.token;
            this.mode = 1;
            this.loopCheckQr();
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    private loopCheckQr() {
        if (this.mode < 1 || this.mode > 2) {
            return;
        }
        window.setTimeout(() => {
            this.authService.qrCheck(this.qrToken).subscribe(
                _ => {
                    this.mode = 5;
                },
                (err: IErrorResult) => {
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
            );
        }, 2000);
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.redirectUri = res.redirect_uri || '/';
        });
    }

    public tapMode(i: number) {
        this.mode = i;
    }

    public tapSignIn() {
        if (!this.loginForm.valid) {
            return;
        }
        const data = Object.assign({}, this.loginForm.value);
        if (this.captchaToken) {
            data.captcha_token = this.captchaToken;
        }
        this.loginSubs = this.authService
            .login(data)
            .subscribe(_ => {},
                err => {
                    const res = err.error as IErrorResponse;
                    this.toastrService.warning(res.message);
                    if (res.captcha_token) {
                        this.captchaToken = res.captcha_token;
                    }
                    this.tapCaptcha();
                });
    }


    private redirectIfUserLoggedIn() {
        this.store.select(getAuthStatus).subscribe(
            data => {
                if (data === true) {
                    this.router.navigateByUrl(this.redirectUri);
                }
            }
        );
    }

    ngOnDestroy() {
        if (this.loginSubs) {
            this.loginSubs.unsubscribe();
        }
    }

    public tapOAuth(type: string) {
        const timestamp = getCurrentTime();
        const sign = Md5.hashStr(environment.appid + timestamp + environment.secret);
        window.location.href = uriEncode(environment.apiEndpoint + 'auth/oauth', {
            appid: environment.appid,
            timestamp,
            sign,
            type,
            redirect_uri: window.location.href,
        }, true);
    }

    public keyDown(event: KeyboardEvent) {
        if (event.code !== 'Enter') {
            return;
        }
        ((event.target as HTMLInputElement).parentNode.nextSibling as HTMLDivElement).querySelector('input').focus();
    }

    public tapCaptcha() {
        if (!this.captchaToken) {
            this.captchaImage = '';
            return;
        }
        this.captchaImage = environment.assetUri + '/auth/captcha?captcha_token=' + this.captchaToken + '&v=' + Math.random();
    }

    public tapSendCode(event: CountdownButtonComponent) {
        event.start(120);
    }

}
