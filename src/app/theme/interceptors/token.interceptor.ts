import { environment } from './../../../environments/environment';
import { inject } from '@angular/core';
import {
  HttpInterceptorFn
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import {Md5} from 'ts-md5';
import { EncryptorService } from '../services/encryptor.service';

function fixUrl(url: string) {
    if (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) {
        return url;
    }
    return environment.apiEndpoint + url;
}

export const TokenInterceptorFn: HttpInterceptorFn = (req, next) => {
    if (req.method === 'JSONP') {
        return next(req);
    }
    const auth = inject(AuthService);
    const encryptor = inject(EncryptorService);
    const timestamp = encryptor.getCurrentTime();
    const sign = Md5.hashStr(environment.appid + timestamp + environment.secret);
    const clonedRequest = req.clone({
        headers: auth.getTokenHeader(req),
        url: fixUrl(req.url),
        params: req.params
                .set('appid', environment.appid)
                .set('timestamp', timestamp)
                .set('sign', sign + '')
    });
    return next(clonedRequest);
};