import { ModuleWithProviders, NgModule } from '@angular/core';
import { ChartDirective } from './chart.directive';
import { CHART_TOKEN, ChartConfigs } from './model';

@NgModule({
    imports: [
        ChartDirective
    ],
    exports: [
        ChartDirective
    ]
})
export class ZreChartModule { 
    static forRoot(config: ChartConfigs): ModuleWithProviders<ZreChartModule> {
        return {
            ngModule: ZreChartModule,
            providers: [
                {
                    provide: CHART_TOKEN,
                    useValue: config,
                }
            ],
        };
    }
    static forChild(): ModuleWithProviders<ZreChartModule> {
        return {
            ngModule: ZreChartModule,
        };
    }
}
