import {
    Injectable,
    Inject,
    PLATFORM_ID
} from '@angular/core';
import {
    HttpRequest,
    HttpHeaders,
    HttpClient
} from '@angular/common/http';
import {
    isPlatformBrowser
} from '@angular/common';
import {
    AuthActions
} from '../actions';
import {
    Store
} from '@ngrx/store';
import {
    AppState
} from '../interfaces';
import {
    Observable,
} from 'rxjs';
import {
    IUser
} from '../models/user';
import {
    CookieService
} from './cookie.service';
import {
    environment
} from '../../../environments/environment';
import { IDataOne } from '../models/page';
import { catchError, map } from 'rxjs/operators';
import { DialogService } from '../../components/dialog';
import { setSystemConfig } from '../actions/system.actions';

const USER_KEY = 'user';

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private actions: AuthActions,
        private store: Store<AppState>,
        private toastrService: DialogService,
        private cookieService: CookieService,
        @Inject(PLATFORM_ID) private platformId: any) {}

    public login(data: any): Observable<IUser> {
        this.store.dispatch(this.actions.checking());
        return this.http.post<IUser>('auth/login', data).pipe(
            map(user => {
                this.setTokenInLocalStorage(user);
                this.authenticateUser(user);
                return user;
            }), 
            catchError(err => {
                this.store.dispatch(this.actions.checking(false));
                throw err;
            }),
        );
    }

    /**
     *
     *
     * @param User data
     * @returns Observable<User>
     *
     */
    public register(data: any): Observable<IUser> {
        this.store.dispatch(this.actions.checking());
        return this.http.post<IUser>('auth/register', data).pipe(
            map(user => {
                this.setTokenInLocalStorage(user);
                this.authenticateUser(user);
                return user;
            }),
        );
    }

    public logout() {
        return this.http.post('auth/logout', {}).pipe(
            map((res: Response) => {
                this.logoutUser();
                return res;
            })
        );
    }

    public sendFindEmail(email: string) {
        return this.http.post<IDataOne<boolean>>('auth/password/send_find_email', {email});
    }

    public sendMobileCode(mobile: string, type = 'login') {
        return this.http.post<IDataOne<boolean>>('auth/password/send_mobile_code', {mobile, type});
    }

    public resetPassword(data: any) {
        return this.http.post<IDataOne<boolean>>('auth/password/reset', data);
    }

    public qrRefresh() {
        return this.http.get<{token: string; qr: string}>('auth/qr/refresh');
    }

    public qrCheck(token: string) {
        return this.http.post<IUser>('auth/qr/check', {token}).pipe(
            map(user => {
                this.setTokenInLocalStorage(user);
                this.authenticateUser(user);
                return user;
            }),
        );
    }

    /**
     * 清除本地的token
     */
    public logoutUser() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.clear();
        }
        this.store.dispatch(this.actions.logout());
    }

    /**
     *
     *
     * @returns HttpHeaders
     */
    public getTokenHeader(request: HttpRequest < any > ): HttpHeaders {
        let headers = request.headers || new HttpHeaders({});
        headers = headers.set('Accept', '*/*');
        if (typeof request.body !== 'object' || !(request.body instanceof FormData)) {
            headers = headers.set('Content-Type', 'application/vnd.api+json');
        }
        const token = this.getUserToken();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }

    private setTokenInLocalStorage(user: any, keyName = USER_KEY): void {
        const jsonData = JSON.stringify(user);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(keyName, jsonData);
        }
    }

    public getUserToken() {
        if (isPlatformBrowser(this.platformId)) {
            const user: IUser = JSON.parse(localStorage.getItem(USER_KEY));
            return user ? user.token : null;
        } else {
            return null;
        }
    }

    public loginFromStorage() {
        const user = this.loadFromStorage();
        if (!user) {
            return false;
        }
        return this.authenticateUser(user);
    }

    public loginFromCookie() {
        const token = this.loadFromCookie();
        if (!token) {
            return;
        }
        this.store.dispatch(this.actions.checking());
        this.http.get<IUser>('auth/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).subscribe({
            next: user => {
                user.token = token;
                this.setTokenInLocalStorage(user);
                this.authenticateUser(user);
            },
            error: _ => {
                this.store.dispatch(this.actions.checking(false));
            }
        });
    }

    /**
     * 系统启动时调用, 加载系统设置和用户登录信息
     */
    public systemBoot() {
        let token = '';
        const user = this.loadFromStorage();
        if (user) {
            token = user.token;
        }
        const key = this.loadFromCookie();
        if (key) {
            token = key;
        }
        const options = token ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        } : {};
        if (token) {
            this.store.dispatch(this.actions.checking());
        }
        this.http.post<{
            seo_configs: any,
            auth_profile: IUser|undefined,
        }>('open/batch', {
            seo_configs: {},
            auth_profile: {},
        }, options).subscribe({
            next: res => {
                if (res.seo_configs) {
                    this.store.dispatch(setSystemConfig({configs: res.seo_configs}));
                }
                if (res.auth_profile && !(res.auth_profile instanceof Array)) {
                    const user = res.auth_profile;
                    user.token = token;
                    this.authenticateUser(user);
                } else {
                    this.store.dispatch(this.actions.checking(false));
                }
            },
            error: _ => {
                this.store.dispatch(this.actions.checking(false));
            }
        });
    }

    private loadFromStorage(): IUser|undefined {
        let user: any = localStorage.getItem(USER_KEY);
        if (!user) {
            return undefined;
        }
        return JSON.parse(user);
    }

    private loadFromCookie(): string|undefined {
        const key = environment.appid + 'token';
        const data = this.cookieService.get(key);
        if (!data) {
            return undefined;
        }
        this.cookieService.delete(key);
        const res = JSON.parse(data);
        if (res.code !== 200) {
            this.toastrService.warning(res.error);
            return undefined;
        }
        return res.token;
    }

    private authenticateUser(user: IUser) {
        this.store.dispatch(this.actions.login(user));
        return true;
    }
}
