import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { activityRoutedComponents, ActivityRoutingModule } from './activity-routing.routing';
import { DialogModule } from '../../dialog';
import { ActivityService } from './activity.service';
import { ThemeModule } from '../../theme/theme.module';

@NgModule({
    imports: [
        CommonModule,
        DialogModule,
        ThemeModule,
        ActivityRoutingModule,
    ],
    declarations: [...activityRoutedComponents],
    providers: [
        ActivityService,
    ]
})
export class ActivityModule { }
