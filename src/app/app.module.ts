import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThemeModule } from './theme/theme.module';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './theme/theme.reducers';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { DialogModule } from './components/dialog';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        BrowserModule.withServerTransition({ appId: 'ng-zo' }),
        HttpClientModule,
        HttpClientJsonpModule,
        AppRoutingModule,
        LazyLoadImageModule,
        ThemeModule.forRoot(),
        DialogModule.forRoot(),
        // 加载store
        StoreModule.forRoot(reducers, { metaReducers }),
        ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
        }),
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
