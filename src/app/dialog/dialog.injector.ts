import { InjectFlags, Injector, ProviderToken } from '@angular/core';

export class DialogPackage<T = any> {
    constructor(
        public data: T,
        public dialogId: any,
    ) {
    }
}

export class DialogInjector<T> implements Injector {

    constructor(
        private data: DialogPackage,
        private parentInjector: Injector
      ) {}

    get<T>(token: ProviderToken<T>, notFoundValue?: T, flags?: InjectFlags): T;
    get(token: any, notFoundValue?: any);
    get(token: any, notFoundValue?: any, flags?: any): any {
        if (token === DialogPackage) {
            return this.data;
          }
          return this.parentInjector.get<T>(token, notFoundValue, flags);
    }
    
}