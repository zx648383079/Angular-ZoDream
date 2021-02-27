import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { activityRoutedComponents, ActivityRoutingModule } from './activity-routing.routing';
import { ThemeModule } from '../../../theme/theme.module';
import { ActivityService } from './activity.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { GoodsModule } from '../goods/goods.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ActivityRoutingModule,
        NgbModule,
        ReactiveFormsModule,
        GoodsModule,
    ],
    declarations: [...activityRoutedComponents],
    providers: [
        ActivityService,
    ]
})
export class ActivityModule { }