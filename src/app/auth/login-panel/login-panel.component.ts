import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'ts-md5';
import { environment } from '../../../environments/environment';
import { CountDownComponent } from '../../theme/components';
import { AppState } from '../../theme/interfaces';
import { IErrorResponse, IErrorResult } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';
import { AuthService } from '../../theme/services';
import { getCurrentTime, uriEncode } from '../../theme/utils';
import { emailValidate, mobileValidate, passwordValidate } from '../../theme/validators';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.scss']
})
export class LoginPanelComponent {

    @Output() public logined = new EventEmitter<IUser>();

    public tabIndex = 2;
    public mobile = '';
    public code = '';
    public email = '';
    public password = '';
    public captcha = '';
    public agree = true;
    public passwordObserve = false;
    private captchaToken = '';
    public captchaImage = '';
    private qrToken = '';
    public qrImage = '';
    public qrStatus = 0;

    constructor(
        private store: Store<AppState>,
        private toastrService: ToastrService,
        private authService: AuthService,
    ) {
        this.store.select(getCurrentUser).subscribe(res => {
            if (!res) {
                return;
            }
            this.logined.emit(res);
        });
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

    public tapSendCode(event: CountDownComponent) {
        if (!mobileValidate(this.mobile)) {
            this.toastrService.warning('请输入正确的手机号');
            return;
        }
        this.authService.sendMobileCode(this.mobile).subscribe(res => {
            event.start(120);
            this.toastrService.success(res.message || '验证码已发送至手机');
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
        this.authService.qrRefresh().subscribe(res => {
            this.qrImage = res.qr;
            this.qrToken = res.token;
            this.tabIndex = 3;
            this.qrStatus = 0;
            this.loopCheckQr();
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapMobileCodeLogin() {
        const data = {
            mobile: this.mobile,
            code: this.code,
        };
        if (!mobileValidate(data.mobile)) {
            this.toastrService.warning('请输入正确的手机号');
            return;
        }
        if (data.code.length < 4) {
            this.toastrService.warning('请输入正确的短信验证码');
            return;
        }
        this.login(data);
    }

    public tapMobileLogin() {
        const data = {
            mobile: this.mobile,
            password: this.password,
        };
        if (!mobileValidate(data.mobile)) {
            this.toastrService.warning('请输入正确的手机号');
            return;
        }
        if (passwordValidate(data.password)) {
            this.toastrService.warning('请输入正确的密码');
            return;
        }
        this.login(data);
    }

    public tapEmailLogin() {
        const data = {
            email: this.email,
            password: this.password,
        };
        if (!emailValidate(data.email)) {
            this.toastrService.warning('请输入正确的邮箱');
            return;
        }
        if (passwordValidate(data.password)) {
            this.toastrService.warning('请输入正确的密码');
            return;
        }
        this.login(data);
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

    private login(data: any) {
        if (this.captchaToken) {
            data.captcha_token = this.captchaToken;
            data.captcha = this.captcha;
        }
        this.authService.login(data).subscribe(_ => {},
                (err: IErrorResult) => {
                    this.toastrService.warning(err.error.message);
                    if (err.error.captcha_token) {
                        this.captchaToken = err.error.captcha_token;
                    }
                    this.tapCaptcha();
                });
    }

    private loopCheckQr() {
        if (this.tabIndex !== 3 || this.qrStatus > 1) {
            return;
        }
        window.setTimeout(() => {
            this.authService.qrCheck(this.qrToken).subscribe(
                _ => {
                    this.qrStatus = 3;
                },
                (err: IErrorResult) => {
                    this.checkHttp(err.error);
                }
            );
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
