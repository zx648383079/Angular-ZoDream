import { Component, OnDestroy, inject, output } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from '../../../../../environments/environment';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent, CountdownEvent } from '../../../../components/form';
import { AppState } from '../../../../theme/interfaces';
import { IErrorResponse, IErrorResult } from '../../../../theme/models/page';
import { IUser } from '../../../../theme/models/user';
import { selectAuthUser } from '../../../../theme/reducers/auth.selectors';
import { AuthService, WebAuthn } from '../../../../theme/services';
import { apiUri } from '../../../../theme/utils';
import { emailValidate, mobileValidate, passwordValidate } from '../../../../theme/validators';
import { Subscription } from 'rxjs';
import { selectSystemConfig } from '../../../../theme/reducers/system.selectors';
import { EncryptorService } from '../../../../theme/services/encryptor.service';

@Component({
    standalone: false,
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.scss']
})
export class LoginPanelComponent implements OnDestroy {
    private store = inject<Store<AppState>>(Store);
    private toastrService = inject(DialogService);
    private authService = inject(AuthService);
    private encryptor = inject(EncryptorService);
    private webAuthn = inject(WebAuthn);


    public readonly logined = output<IUser>();

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
    public twoFaCode = '';
    public recoveryCode = '';
    public qrStatus = 0;
    private subItems = new Subscription();
    private inputData: any = {};

    constructor() {
        this.subItems.add(
            this.store.select(selectAuthUser).subscribe(res => {
                if (!res) {
                    return;
                }
                this.logined.emit(res);
            })
        );
        this.subItems.add(
            this.store.select(selectSystemConfig).subscribe(res => {
                this.openAuth = res && res.auth_oauth;
            })
        );
        this.openWebAuthn = this.webAuthn.enabled;
    }

    ngOnDestroy() {
        this.subItems.unsubscribe();
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

    public tapSignIn(e?: ButtonEvent) {
        const data = this.loadSignInData();
        if (!data) {
            return;
        }
        if (this.captchaToken) {
            data.captcha_token = this.captchaToken;
            data.captcha = this.captcha;
        }
        e?.enter();
        if (data.password) {
            data.password = this.encryptor.encrypt(data.password);
        }
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
                if (err.error.code === 1015) {
                    this.tabIndex = 8;
                    this.inputData = data;
                }
            }
        });
    }

    private loadSignInData(): any {
        switch (this.tabIndex) {
            case 1:
                return this.loadMobilePassword();
            case 2:
                return this.loadEmailPassword();
            case 4:
                return this.load2FA();
            case 5:
                return this.loadRecoveryCode();
            default:
                return this.loadMobileCode();
        }
    }

    private load2FA(): any {
        if (!mobileValidate(this.twoFaCode)) {
            this.toastrService.warning($localize `Please input the authentication code`);
            return;
        }
        return {...this.inputData, twofa_code: this.twoFaCode};
    }

    private loadRecoveryCode(): any {
        if (!mobileValidate(this.recoveryCode)) {
            this.toastrService.warning($localize `Please input the recovery code`);
            return;
        }
        return {...this.inputData, recovery_code: this.recoveryCode};
    }

    private loadMobileCode(): any {
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
        return data;
    }

    private loadMobilePassword(): any {
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
        return data;
    }

    private loadEmailPassword(): any {
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
        return data;
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
