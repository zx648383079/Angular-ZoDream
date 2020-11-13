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
    of
} from 'rxjs';
import {
    IUser
} from '../models/user';
import {
    map,
    tap,
    catchError
} from 'rxjs/operators';
import {
    ToastrService
} from 'ngx-toastr';
import {
    Router
} from '@angular/router';
import {
    CookieService
} from './cookie.service';
import {
    environment
} from '../../../environments/environment';

const USER_KEY = 'user';

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private actions: AuthActions,
        private store: Store < AppState > ,
        private toastrService: ToastrService,
        private cookieService: CookieService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: any) {}

    public login(data: any): Observable < IUser > {
        return this.http.post < IUser > ('auth/login', data).pipe(
            map(user => {
                this.setTokenInLocalStorage(user, USER_KEY);
                this.authenticateUser(user);
                return user;
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
    public register(data: any): Observable < IUser > {
        return this.http.post < IUser > ('auth/register', data).pipe(
            map(user => {
                this.setTokenInLocalStorage(user, USER_KEY);
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

    private setTokenInLocalStorage(user: any, keyName: string): void {
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
        let user: any = localStorage.getItem(USER_KEY);
        if (!user) {
            return false;
        }
        user = JSON.parse(user);
        return this.authenticateUser(user);
    }

    public loginFromCookie() {
        const key = environment.appid + 'token';
        const data = this.cookieService.get(key);
        if (!data) {
            return;
        }
        this.cookieService.delete(key);
        const res = JSON.parse(data);
        if (res.code !== 200) {
            this.toastrService.warning(res.error);
            return;
        }
        const token = res.token;
        this.http.get<IUser>('auth/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).subscribe(user => {
            user.token = token;
            this.setTokenInLocalStorage(user, USER_KEY);
        });
    }

    private authenticateUser(user: IUser) {
        this.store.dispatch(this.actions.login(user));
        return true;
    }
}
