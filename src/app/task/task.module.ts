import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { taskRoutingComponents, TaskRoutingModule } from './task-routing.module';
import { TaskService } from './task.service';
import { ThemeModule } from '../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    ThemeModule,
    TaskRoutingModule,
  ],
  declarations: [...taskRoutingComponents],
  providers: [
    TaskService,
  ]
})
export class TaskModule { }
