import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendRoutingModule, backendRoutedComponents } from './backend-routing.module';
import { ThemeModule } from '../theme/theme.module';


@NgModule({
  declarations: [...backendRoutedComponents],
  imports: [
    CommonModule,
    ThemeModule,
    BackendRoutingModule,
    // NgxEchartsModule.forRoot({
    //   echarts: () => import('echarts'),
    // }),
  ]
})
export class BackendModule { }
