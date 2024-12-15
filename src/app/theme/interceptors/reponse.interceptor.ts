import { HttpEvent, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';

export const ResponseInterceptorFn: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(catchError((event: HttpEvent<any>) => {
        if (event instanceof HttpErrorResponse) {
            if (event.status === 401) {
                const auth = inject(AuthService);
                auth.logoutUser();
            }
        }
        return throwError(() => event);
    }));
}
