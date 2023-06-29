import { InjectOptions, Injector, ProviderToken } from '@angular/core';
import { GameRouterInjectorToken, IGameRouter } from './model';

export class GameInjector implements Injector {

    constructor(
        private router: IGameRouter,
        private parentInjector: Injector
      ) {}

    public get<T>(token: ProviderToken<T>, notFoundValue?: T, option?: InjectOptions): T;
    public get(token: any, notFoundValue?: any): any;
    public get<T>(token: any, notFoundValue?: any, flags?: any): any {
        if (token === GameRouterInjectorToken) {
            return this.router;
          }
          return this.parentInjector.get<T>(token, notFoundValue, flags);
    }
    
}