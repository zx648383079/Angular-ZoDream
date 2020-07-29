import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { activityRoutedComponents, ActivityRoutingModule } from './activity-routing.routing';
import { ThemeModule } from '../../../theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ActivityRoutingModule
  ],
  declarations: [...activityRoutedComponents]
})
export class ActivityModule { }
