import { NgModule } from '@angular/core';
import { GoodsRoutingModule, goodsRoutedComponents, goodsPipes } from './goods-routing.module';
import { GoodsService } from './goods.service';
import { ThemeModule } from '../../../theme/theme.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AttributeService } from './attribute.service';
import { SkuFormComponent } from './sku-form/sku-form.component';

@NgModule({
  imports: [
    ThemeModule,
    NgbPaginationModule,
    GoodsRoutingModule,
    ReactiveFormsModule,
    EditorModule,
  ],
  declarations: [
    ...goodsRoutedComponents,
    ...goodsPipes,
    SkuFormComponent,
  ],
  providers: [
    GoodsService,
    AttributeService,
  ]
})
export class GoodsModule { }
