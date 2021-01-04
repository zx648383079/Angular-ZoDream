import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { taskRoutingComponents, TaskRoutingModule } from './task-routing.module';
import { TaskService } from './task.service';
import { ThemeModule } from '../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    ThemeModule,
    TaskRoutingModule,
    NgxEchartsModule.forRoot({ echarts }),
  ],
  declarations: [...taskRoutingComponents],
  providers: [
    TaskService,
  ]
})
export class TaskModule { }
