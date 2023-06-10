import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { activityRoutedComponents, ActivityRoutingModule } from './activity-routing.routing';
import { ThemeModule } from '../../../../theme/theme.module';
import { ActivityService } from './activity.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../../../components/dialog';
import { ZreFormModule } from '../../../../components/form';
import { ShopManageModule } from '../../components';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ActivityRoutingModule,
        ReactiveFormsModule,
        ShopManageModule,
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...activityRoutedComponents],
    providers: [
        ActivityService,
    ]
})
export class ActivityModule { }
