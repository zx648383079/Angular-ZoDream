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
        this.store.dispatch(this.actions.getCurrentUserSuccess(JSON.parse(localStorage.getItem(USER_KEY))));
        this.store.dispatch(this.actions.loginSuccess());
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
  public register(data: IUser): Observable<IUser> {
    const params = { data: { type: 'user', attributes: data } };
    return this.http.post<IUser>('auth/register', params).pipe(
      map(user => {
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
        if (isPlatformBrowser(this.platformId)) {
          localStorage.clear();
        }
        this.store.dispatch(this.actions.logoutSuccess());
        return res;
      })
    );
  }

  /**
   *
   *
   * @returns HttpHeaders
   */
  getTokenHeader(request: HttpRequest<any>): HttpHeaders {
    if (this.getUserToken()) {
      return new HttpHeaders({
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${this.getUserToken()}`,
        'Accept': '*/*'
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/vnd.api+json',
        'Accept': '*/*'
      });
    }

  }

  private setTokenInLocalStorage(user: any, keyName: string): void {
    const jsonData = JSON.stringify(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(keyName, jsonData);
    }
  }

  getUserToken() {
    if (isPlatformBrowser(this.platformId)) {
      const user: IUser = JSON.parse(localStorage.getItem(USER_KEY));
      return user ? user.token : null;
    } else {
      return null;
    }
  }

  loginFromStorage() {
    let user: any = localStorage.getItem(USER_KEY);
    if (!user) {
      return;
    }
    user = JSON.parse(user);
    this.store.dispatch(this.actions.getCurrentUserSuccess(user as IUser));
    this.store.dispatch(this.actions.loginSuccess());
  }
}
