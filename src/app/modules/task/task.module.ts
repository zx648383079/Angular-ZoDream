import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { taskRoutingComponents, TaskRoutingModule } from './task-routing.module';
import { TaskService } from './task.service';
import { ThemeModule } from '../../theme/theme.module';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { TabletModule } from '../../components/tablet';
import { ZreChartModule } from '../../components/chart';
import { Field } from '@angular/forms/signals';


@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DesktopModule,
        TabletModule,
        TaskRoutingModule,
        DialogModule,
        ZreFormModule,
        ZreChartModule.forChild()
    ],
    declarations: [...taskRoutingComponents],
    providers: [
        TaskService,
    ]
})
export class TaskModule { }
