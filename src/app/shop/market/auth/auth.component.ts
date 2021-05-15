import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../dialog';
import { Md5 } from 'ts-md5';
import { environment } from '../../../../environments/environment';
import { CountdownButtonComponent } from '../../../theme/components';
import { IErrorResponse } from '../../../theme/models/page';
import { getAuthStatus } from '../../../theme/reducers/auth.selectors';
import { AuthService } from '../../../theme/services';
import { getCurrentTime, uriEncode } from '../../../theme/utils';
import { mobileValidator, passwordValidator } from '../../../theme/validators';
import { ShopAppState } from '../../shop.reducer';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    public tabIndex = 0;
    private redirectUri: string;
    public isObserve = false;

    public emailForm = this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        password: ['', [passwordValidator, Validators.required]],
        remember: [false],
        captcha: [''],
    });

    public mobileForm = this.fb.group({
        mobile: ['', [mobileValidator, Validators.required]],
        code: ['', [Validators.required, Validators.minLength(4)]],
        remember: [false],
        captcha: [''],
    });

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private store: Store<ShopAppState>,
    ) {
        this.store.select(getAuthStatus).subscribe(
            data => {
                if (data === true) {
                    this.router.navigateByUrl(this.redirectUri);
                }
            }
        );
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.redirectUri = res.redirect_uri || '/shop';
        });
    }

    public tapSignIn() {
        const form = this.tabIndex < 1 ? this.mobileForm : this.emailForm;
        if (!form.valid) {
            return;
        }
        const data = Object.assign({}, form.value);
        this.authService
            .login(data)
            .subscribe(_ => {},
                err => {
                    const res = err.error as IErrorResponse;
                    this.toastrService.warning(res.message);
                });
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

    public tapSendCode(event: CountdownButtonComponent) {
        event.start(120);
    }

}
