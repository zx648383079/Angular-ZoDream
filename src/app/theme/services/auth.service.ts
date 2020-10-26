import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpRequest, HttpHeaders, HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthActions } from '../actions';
import { Store } from '@ngrx/store';
import { AppState } from '../interfaces';
import { Observable, of } from 'rxjs';
import { IUser } from '../models/user';
import { map, tap, catchError } from 'rxjs/operators';
import { ToastrService} from 'ngx-toastr';
import { Router } from '@angular/router';

const USER_KEY = 'user';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private actions: AuthActions,
    private store: Store<AppState>,
    private toastrService: ToastrService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any) {}

  public login(data: any): Observable<IUser> {
    return this.http.post<IUser>('auth/login', data).pipe(
      map(user => {
        this.setTokenInLocalStorage(user, USER_KEY);
        this.authenticateUser(user);
        return user;
      }),
      tap(
        _ => _/*this.router.navigate(['/'])*/,
        error => {
          this.toastrService.error(error.error.message, 'ERROR!');
        }
      ),
      catchError(error => {
        return of(error);
      })
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
    return this.http.post<IUser>('auth/register', data).pipe(
      map(user => {
        this.setTokenInLocalStorage(user, USER_KEY);
        this.authenticateUser(user);
        return user;
      }),
      tap(
        _ => {
          this.toastrService.success('You are successfully registerd!', 'Success!!');
          this.router.navigate(['auth', 'login']);
        },
        _ => this.toastrService.error('Invalid/Existing data', 'ERROR!!')
      )
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
  getTokenHeader(request: HttpRequest<any>): HttpHeaders {
    const headers: any = {
      'Content-Type': 'application/vnd.api+json',
      Accept: '*/*'
    };
    if (typeof request.body === 'object' && request.body instanceof FormData) {
      delete headers['Content-Type'];
    }
    if (this.getUserToken()) {
      headers.Authorization = `Bearer ${this.getUserToken()}`;
    }
    return new HttpHeaders(headers);
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

  private authenticateUser(user: IUser) {
    this.store.dispatch(this.actions.login(user));
    return true;
  }
}
