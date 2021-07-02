import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { taskRoutingComponents, TaskRoutingModule } from './task-routing.module';
import { TaskService } from './task.service';
import { ThemeModule } from '../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { DialogModule } from '../dialog';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';
// Import the Canvas renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {
  CanvasRenderer
} from 'echarts/renderers';
import 'echarts/theme/macarons.js';
import { ZreFormModule } from '../form';

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer]
);

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        ThemeModule,
        TaskRoutingModule,
        NgxEchartsModule.forRoot({ echarts }),
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...taskRoutingComponents],
    providers: [
        TaskService,
    ]
})
export class TaskModule { }
