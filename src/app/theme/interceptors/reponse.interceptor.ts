import { HttpEvent, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';

export const ResponseInterceptorFn: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    return next(req).pipe(catchError((event: HttpEvent<any>) => {
        if (event instanceof HttpErrorResponse) {
            if (event.status === 401) {
                auth.logoutUser();
            }
        }
        return throwError(() => event);
    }));
}
