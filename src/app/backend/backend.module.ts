import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendRoutingModule, backendRoutedComponents } from './backend-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { BackendService } from './backend.service';
import { MenuService } from './menu.service';


@NgModule({
    declarations: [...backendRoutedComponents],
    imports: [
        CommonModule,
        ThemeModule,
        BackendRoutingModule,
        // NgxEchartsModule.forRoot({
        //   echarts: () => import('echarts'),
        // }),
    ],
    providers: [
        BackendService,
        MenuService,
    ]
})
export class BackendModule { }
