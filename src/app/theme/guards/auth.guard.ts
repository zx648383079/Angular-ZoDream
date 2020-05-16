import { Subscription ,  Observable } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../interfaces';
import { getAuthStatus } from '../reducers/selectors';
import { ThemeService } from '../services';


@Injectable()
export class CanActivateViaAuthGuard implements CanActivate, OnDestroy {
  isAuthenticated: boolean;
  subscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private theme: ThemeService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.subscription = this.store
      .select(getAuthStatus)
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        if (!isAuthenticated) {
          this.router.navigate(
            [this.theme.isMobile() ? '/auth' : '/auth'],
            { queryParams: { returnUrl: state.url }}
          );
        }
      });

    return this.isAuthenticated;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
