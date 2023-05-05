import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShopBackendRoutingModule, shopBackendRoutedComponents } from './shop-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { ShopService } from './shop.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { ArticleService } from './article.service';
import { AdService } from './ad.service';
import { RegionService } from './region.service';
import { PaymentService } from './payment.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { OpenModule } from '../../../backend/open/open.module';
import { DialogModule } from '../../../components/dialog';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';
import {
  CanvasRenderer
} from 'echarts/renderers';
import 'echarts/theme/macarons.js';
import { ZreFormModule } from '../../../components/form';

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer]
);

@NgModule({
    declarations: [...shopBackendRoutedComponents],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgbModule,
        ThemeModule,
        ShopBackendRoutingModule,
        EditorModule,
        NgxEchartsModule.forRoot({ echarts }),
        OpenModule,
        DialogModule,
        ZreFormModule,
    ],
    providers: [
        ShopService,
        ArticleService,
        AdService,
        RegionService,
        PaymentService,
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
    ],
})
export class ShopBackendModule { }
