import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../../components/dialog';
import { Md5 } from 'ts-md5';
import { environment } from '../../../../../environments/environment';
import { IErrorResponse } from '../../../../theme/models/page';
import { selectAuthStatus } from '../../../../theme/reducers/auth.selectors';
import { AuthService } from '../../../../theme/services';
import { assetUri, getCurrentTime, uriEncode } from '../../../../theme/utils';
import { ShopAppState } from '../../shop.reducer';
import { email, form, required } from '@angular/forms/signals';
import { CountdownEvent } from '../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly authService = inject(AuthService);
    private readonly store = inject<Store<ShopAppState>>(Store);


    public tabIndex = 0;
    private redirectUri: string;
    public isObserve = false;

    public emailModel = signal({
        email: '',
        password: '',
        remember: false,
        captcha: '',
    });
    public emailForm = form(this.emailModel, schemaPath => {
        email(schemaPath.email);
        required(schemaPath.email);
        required(schemaPath.password);
    });

    public mobileModel = signal({
        mobile: '',
        code: '',
        remember: false,
        captcha: '',
    });
    public mobileForm = form(this.mobileModel, schemaPath => {
        email(schemaPath.mobile);
        required(schemaPath.code);
    });

    public get boxStyle() {
        const bg = assetUri('assets/images/sd_bg.png');
        return {
            'background-image': `url(${bg})`
        };
    }

    constructor() {
        this.store.select(selectAuthStatus).subscribe(
            data => {
                if (!data.guest) {
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

    public tapSubmit(e: SubmitEvent) {
        e.preventDefault();
        if (this.tabIndex < 1) {
            if (this.mobileForm().invalid()) {
                return;
            }
        } else if (this.emailForm().invalid()) {
            return;
        }
        const data = this.tabIndex < 1 ? this.mobileForm().value() : this.emailForm().value();
        this.authService
            .login(data)
            .subscribe({
                error: err => {
                    const res = err.error as IErrorResponse;
                    this.toastrService.warning(res.message);
                }
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

    public tapSendCode(event: CountdownEvent) {
        event.start(120);
    }

}
