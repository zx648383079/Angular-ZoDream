import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_ID, LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThemeModule } from './theme/theme.module';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './theme/theme.reducers';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { DialogModule } from './components/dialog';
import { NgxEchartsModule } from 'ngx-echarts';
import { provideHttpClient, withInterceptors, withJsonpSupport } from '@angular/common/http';
import { ResponseInterceptorFn, TokenInterceptorFn, TransferStateInterceptorFn } from './theme/interceptors';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ThemeModule.forRoot(),
        DialogModule.forRoot(),
        NgxEchartsModule.forRoot({ 
            echarts: () => import('echarts')
        }),
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
        provideHttpClient(withInterceptors([TransferStateInterceptorFn, TokenInterceptorFn, ResponseInterceptorFn]), withJsonpSupport()),
        // { provide: APP_BASE_HREF, useValue: '/' },
        { provide: APP_ID, useValue: 'ng-zo' },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
