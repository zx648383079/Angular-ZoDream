import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { inject } from '@angular/core';
import {
  HttpResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { TransferStateService } from '../services/transfer-state.service';


export const TransferStateInterceptorFn: HttpInterceptorFn = (req, next) => {
    const transferStateService = inject(TransferStateService);
    /**
     * Skip this interceptor if the request method isn't GET.
     */
    if (req.method !== 'GET') {
        return next(req);
    }
  
    const cachedResponse = transferStateService.getCache(req.url);
    if (cachedResponse) {
        // A cached response exists which means server set it before. Serve it instead of forwarding
        // the request to the next handler.
        return of(new HttpResponse<any>({ body: cachedResponse }));
    }
  
      /**
       * No cached response exists. Go to the network, and cache
       * the response when it arrives.
       */
    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                transferStateService.setCache(req.url, event.body);
            }
        })
    );
}

