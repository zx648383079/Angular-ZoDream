import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShopBackendRoutingModule, shopBackendRoutedComponents } from './shop-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { ShopService } from './shop.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ArticleService } from './article.service';
import { AdService } from './ad.service';
import { RegionService } from './region.service';
import { PaymentService } from './payment.service';
import { OpenModule } from '../../../backend/open/open.module';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { ZreEditorModule } from '../../../components/editor';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    declarations: [...shopBackendRoutedComponents],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgSelectModule,
        ThemeModule,
        ShopBackendRoutingModule,
        ZreEditorModule,
        OpenModule,
        DialogModule,
        ZreFormModule,
        NgxEchartsModule.forChild()
    ],
    providers: [
        ShopService,
        ArticleService,
        AdService,
        RegionService,
        PaymentService,
    ],
})
export class ShopBackendModule { }
