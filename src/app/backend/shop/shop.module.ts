import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShopRoutingModule, shopRoutedComponents } from './shop-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ShopService } from './shop.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ArticleService } from './article.service';
import { AdService } from './ad.service';
import { RegionService } from './region.service';
import { PaymentService } from './payment.service';
import { OpenModule } from '../open/open.module';


@NgModule({
  declarations: [...shopRoutedComponents],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    ThemeModule,
    ShopRoutingModule,
    EditorModule,
    OpenModule,
  ],
  providers: [
    ShopService,
    ArticleService,
    AdService,
    RegionService,
    PaymentService,
  ],
})
export class ShopModule { }
