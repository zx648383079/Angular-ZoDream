import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { taskRoutingComponents, TaskRoutingModule } from './task-routing.module';
import { TaskService } from './task.service';
import { ThemeModule } from '../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { NgxEchartsModule } from 'ngx-echarts';
import { DesktopModule } from '../../components/desktop';
import { TabletModule } from '../../components/tablet';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ThemeModule,
        DesktopModule,
        TabletModule,
        TaskRoutingModule,
        DialogModule,
        ZreFormModule,
        NgxEchartsModule.forChild()
    ],
    declarations: [...taskRoutingComponents],
    providers: [
        TaskService,
    ]
})
export class TaskModule { }
