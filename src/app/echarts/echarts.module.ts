import { NgModule, ModuleWithProviders } from '@angular/core';
import { EchartsDirective, EchartsConfig, ECHARTS_CONFIG } from './echarts.directive';

@NgModule({
  imports: [],
  declarations: [EchartsDirective],
  exports: [EchartsDirective],
})
export class EchartsModule {
  static forRoot(config: EchartsConfig): ModuleWithProviders<EchartsModule> {
    return {
      ngModule: EchartsModule,
      providers: [{ provide: ECHARTS_CONFIG, useValue: config }],
    };
  }
  static forChild() {
    return {
      ngModule: EchartsModule,
    };
  }
}

export { EchartsDirective };