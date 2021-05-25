import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { activityRoutedComponents, ActivityRoutingModule } from './activity-routing.routing';
import { ThemeModule } from '../../../theme/theme.module';
import { ActivityService } from './activity.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { GoodsModule } from '../goods/goods.module';
import { DialogModule } from '../../../dialog';
import { ZreFormModule } from '../../../form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ActivityRoutingModule,
        NgbModule,
        ReactiveFormsModule,
        GoodsModule,
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...activityRoutedComponents],
    providers: [
        ActivityService,
    ]
})
export class ActivityModule { }
