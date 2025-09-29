import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { taskRoutingComponents, TaskRoutingModule } from './task-routing.module';
import { TaskService } from './task.service';
import { ThemeModule } from '../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { TabletModule } from '../../components/tablet';
import { ZreChartModule } from '../../components/chart';


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
        ZreChartModule.forChild()
    ],
    declarations: [...taskRoutingComponents],
    providers: [
        TaskService,
    ]
})
export class TaskModule { }
