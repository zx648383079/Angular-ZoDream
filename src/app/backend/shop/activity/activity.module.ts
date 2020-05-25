import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { activityRoutedComponents, ActivityRoutingModule } from './activity-routing.routing';

@NgModule({
  imports: [
    CommonModule,
    ActivityRoutingModule
  ],
  declarations: [...activityRoutedComponents]
})
export class ActivityModule { }
