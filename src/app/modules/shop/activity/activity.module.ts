import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { activityRoutedComponents, ActivityRoutingModule } from './activity-routing.routing';
import { DialogModule } from '../../../components/dialog';
import { ActivityService } from './activity.service';
import { ThemeModule } from '../../../theme/theme.module';
import { ShopCommonModule } from '../common.module';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        DialogModule,
        ThemeModule,
        DesktopModule,
        ActivityRoutingModule,
        ShopCommonModule,
        ZreFormModule,
    ],
    declarations: [...activityRoutedComponents],
    providers: [
        ActivityService,
    ]
})
export class ActivityModule { }
