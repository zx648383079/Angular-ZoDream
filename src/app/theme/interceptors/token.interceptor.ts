import { environment } from './../../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {Md5} from 'ts-md5';
import { getCurrentTime } from '../utils';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.method === 'JSONP') {
            return next.handle(request);
        }
        const auth = this.injector.get(AuthService);
        const timestamp = getCurrentTime();
        const sign = Md5.hashStr(environment.appid + timestamp + environment.secret);
        const clonedRequest = request.clone({
            headers: auth.getTokenHeader(request),
            url: this.fixUrl(request.url),
            params: request.params
                    .set('appid', environment.appid)
                    .set('timestamp', timestamp)
                    .set('sign', sign + '')
        });
        return next.handle(clonedRequest);
    }

    private fixUrl(url: string) {
        if (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) {
            return url;
        }
        return environment.apiEndpoint + url;
    }
}
