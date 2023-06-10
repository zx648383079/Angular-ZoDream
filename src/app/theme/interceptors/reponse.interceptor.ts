import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth.service';
import { Injectable, Injector } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((event: HttpEvent<any>) => {
            if (event instanceof HttpErrorResponse) {
                if (event.status === 401) {
                    const auth = this.injector.get(AuthService);
                    auth.logoutUser();
                }
            }
            return throwError(() => event);
        }));
    }
}
