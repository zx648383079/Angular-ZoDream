import { Injectable, PLATFORM_ID, TransferState, makeStateKey, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const transferStateCache = {} as any;

@Injectable()
export class TransferStateService {
    private transferState = inject(TransferState);
    private platformId = inject<Object>(PLATFORM_ID);


    public setCache(key: string, data: any) {
        if (!isPlatformBrowser(this.platformId)) {
            transferStateCache[key] = makeStateKey<any>(key);
            this.transferState.set(transferStateCache[key], data);
        }
    }

    public getCache(key: string): any {
        if (isPlatformBrowser(this.platformId)) {
            transferStateCache[key] = makeStateKey<any>(key);
            const cachedData: any = this.transferState.get(transferStateCache[key], null);
            this.transferState.remove(transferStateCache[key]);
            return cachedData;
        }
    }
}
