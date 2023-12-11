import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Md5 } from 'ts-md5';
import { environment } from '../../../../../environments/environment';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent, CountdownEvent } from '../../../../components/form';
import { AppState } from '../../../../theme/interfaces';
import { IErrorResponse, IErrorResult } from '../../../../theme/models/page';
import { IUser } from '../../../../theme/models/user';
import { selectAuthUser } from '../../../../theme/reducers/auth.selectors';
import { AuthService, WebAuthn } from '../../../../theme/services';
import { apiUri, getCurrentTime, uriEncode } from '../../../../theme/utils';
import { emailValidate, mobileValidate, passwordValidate } from '../../../../theme/validators';
import { Subscription } from 'rxjs';
import { selectSystemConfig } from '../../../../theme/reducers/system.selectors';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.scss']
})
export class LoginPanelComponent implements OnDestroy {

    @Output() public logined = new EventEmitter<IUser>();

    public tabIndex = 2;
    public mobile = '';
    public code = '';
    public email = '';
    public password = '';
    public captcha = '';
    public agree = true;
    public passwordObserve = false;
    public openAuth = false;
    public openWebAuthn = true;
    private captchaToken = '';
    public captchaImage = '';
    private qrToken = '';
    public qrImage = '';
    public qrStatus = 0;
    private subItems: Subscription[] = [];

    constructor(
        private store: Store<AppState>,
        private toastrService: DialogService,
        private authService: AuthService,
        private webAuthn: WebAuthn
    ) {
        this.subItems.push(
            this.store.select(selectAuthUser).subscribe(res => {
                if (!res) {
                    return;
                }
                this.logined.emit(res);
            })
        );
        this.subItems.push(
            this.store.select(selectSystemConfig).subscribe(res => {
                this.openAuth = res && res.auth_oauth;
            })
        );
        this.openWebAuthn = this.webAuthn.enabled;
    }

    ngOnDestroy() {
        for (const item of this.subItems) {
            item.unsubscribe();
        }
    }

    public tapTab(i: number) {
        if (i === 3) {
            this.tapRefreshQr();
            return;
        }
        this.tabIndex = i;
    }

    public tapClearMobile() {
        this.mobile = '';
    }

    public tapClearEmail() {
        this.email = '';
    }

    public tapToggleObserve() {
        this.passwordObserve = !this.passwordObserve;
    }

    public tapToggleAgree() {
        this.agree = !this.agree;
    }

    public tapSendCode(event: CountdownEvent) {
        if (!mobileValidate(this.mobile)) {
            this.toastrService.warning($localize `Please input phone number`);
            return;
        }
        this.authService.sendMobileCode(this.mobile).subscribe(res => {
            event.start(120);
            this.toastrService.success(res.message || $localize `The verification code has been sent to the phone `);
        });
    }

    public tapCaptcha() {
        if (!this.captchaToken) {
            this.captchaImage = '';
            return;
        }
        this.captchaImage = environment.assetUri + '/auth/captcha?captcha_token=' + this.captchaToken + '&v=' + Math.random();
    }

    public tapRefreshQr() {
        this.authService.qrRefresh().subscribe({
            next: res => {
                this.qrImage = res.qr;
                this.qrToken = res.token;
                this.tabIndex = 3;
                this.qrStatus = 0;
                this.loopCheckQr();
            }, 
            error: (err: IErrorResult) => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapMobileCodeLogin(e?: ButtonEvent) {
        const data = {
            mobile: this.mobile,
            code: this.code,
        };
        if (!mobileValidate(data.mobile)) {
            this.toastrService.warning($localize `Please input phone number`);
            return;
        }
        if (data.code.length < 4) {
            this.toastrService.warning($localize `Please input the SMS verification code`);
            return;
        }
        this.login(data, e);
    }

    public tapMobileLogin(e?: ButtonEvent) {
        const data = {
            mobile: this.mobile,
            password: this.password,
        };
        if (!mobileValidate(data.mobile)) {
            this.toastrService.warning($localize `Please input phone number`);
            return;
        }
        if (!passwordValidate(data.password)) {
            this.toastrService.warning($localize `Please input the password`);
            return;
        }
        this.login(data, e);
    }

    public tapEmailLogin(e?: ButtonEvent) {
        const data = {
            email: this.email,
            password: this.password,
        };
        if (!emailValidate(data.email)) {
            this.toastrService.warning($localize `Please input your email`);
            return;
        }
        if (!passwordValidate(data.password)) {
            this.toastrService.warning($localize `Please input the password`);
            return;
        }
        this.login(data, e);
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

    private login(data: any, e?: ButtonEvent) {
        if (this.captchaToken) {
            data.captcha_token = this.captchaToken;
            data.captcha = this.captcha;
        }
        e?.enter();
        this.authService.login(data).subscribe({
            next: _ => {
                e?.reset();
            },
            error: (err: IErrorResult) => {
                e?.reset();
                this.toastrService.warning(err.error.message);
                if (err.error.captcha_token) {
                    this.captchaToken = err.error.captcha_token;
                }
                this.tapCaptcha();
            }
        });
    }

    private loopCheckQr() {
        if (this.tabIndex !== 3 || this.qrStatus > 1) {
            return;
        }
        window.setTimeout(() => {
            this.authService.qrCheck(this.qrToken).subscribe({
                next: _ => {
                    this.qrStatus = 3;
                },
                error: (err: IErrorResult) => {
                    this.checkHttp(err.error);
                }
            });
        }, 2000);
    }

    private checkHttp(err: IErrorResponse) {
        if (err.code === 201) {
            this.loopCheckQr();
            return;
        }
        if (err.code === 204) {
            this.qrStatus = 2;
            return;
        }
        if (err.code === 202) {
            this.qrStatus = 1;
            this.loopCheckQr();
            return;
        }
        this.qrStatus = 4;
    }


}
