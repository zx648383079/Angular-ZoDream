import { provideStoreDevtools } from '@ngrx/store-devtools';

export const environment = {
    production: false,
    apiEndpoint: 'http://zodream.localhost/open/',
    assetUri: 'http://zodream.localhost',
    appid: '11543906547',
    secret: '012e936d3d3653b40c6fc5a32e4ea685',
    providers: [provideStoreDevtools({ maxAge: 25 })],
};

