import {
    Injectable,
    PLATFORM_ID,
    inject
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
    IUser, IUserStatus
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
import { selectAuth } from '../reducers/auth.selectors';
import { Router } from '@angular/router';

const USER_KEY = 'user';

@Injectable()
export class AuthService {

    private readonly http = inject(HttpClient);
    private readonly actions = inject(AuthActions);
    private readonly store = inject(Store<AppState>);
    private readonly router = inject(Router);
    private readonly toastrService = inject(DialogService);
    private readonly cookieService = inject(CookieService);
    private readonly platformId = inject(PLATFORM_ID);
    
    /**
     * 是否能跳转到路径
     * @param uri 当前的网址
     * @param roles 需要的权限
     * @returns 
     */
    public canActivate(uri: string, ...roles: string[]) {
        return this.store
        .select(selectAuth)
        .pipe(map(res => {
            if (res.guest) {
                return this.router.createUrlTree(['/auth'], {queryParams: {redirect_uri: uri}});
            }
            if (roles.length === 0) {
                return true;
            }
            if (res.roles) {
                for (const item of roles) {
                    if (res.roles.indexOf(item)) {
                        return true;
                    }
                }
            }
            this.toastrService.error($localize `No permission to access`);
            return false;
        }));
    }

    public login(data: any): Observable<IUser> {
        this.store.dispatch(this.actions.checking());
        return this.http.post<IUser>('auth/login', data).pipe(
            map(user => {
                this.setUser(user);
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
                this.setUser(user);
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
                this.setUser(user);
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

    public loadProfile(extra: string) {
        return this.http.get<IUserStatus>('auth/user', {
            params: {extra}
        }).pipe(
            map(res => {
                if (res) {
                    this.store.dispatch(this.actions.update(res));
                }
                return res;
            })
        );
    }

    /**
     *
     *
     * @returns HttpHeaders
     */
    public getTokenHeader(request: HttpRequest<any>): HttpHeaders {
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
        return this.setUser(user, false);
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
                this.setUser(user);
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
                    this.setUser(user, false);
                } else {
                    this.store.dispatch(this.actions.checking(false));
                }
            },
            error: _ => {
                this.store.dispatch(this.actions.checking(false));
            }
        });
    }

    /**
     * 保存user 到本地
     * @param user 
     * @param withToken 是否更新token
     */
    public setUser(user: IUser, withToken = true) {
        if (withToken) {
            this.setTokenInLocalStorage(user);
        }
        this.store.dispatch(this.actions.login(user));
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

}
