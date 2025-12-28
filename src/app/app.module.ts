import { BrowserModule } from '@angular/platform-browser';
import { APP_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThemeModule } from './theme/theme.module';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './theme/theme.reducers';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { DialogModule } from './components/dialog';
import { provideHttpClient, withInterceptors, withJsonpSupport } from '@angular/common/http';
import { ResponseInterceptorFn, TokenInterceptorFn, TransferStateInterceptorFn } from './theme/interceptors';
import { ZreChartModule } from './components/chart';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { assetUri } from './theme/utils';

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    BarChart,
    LineChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
]);

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ThemeModule.forRoot(),
        DialogModule.forRoot(),
        ZreChartModule.forRoot({ 
            echarts
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
        { provide: APP_ID, useValue: 'ng-zre' },
        {
            provide: IMAGE_LOADER,
            useValue: (config: ImageLoaderConfig) => {
                return assetUri(config.src);
            },
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
