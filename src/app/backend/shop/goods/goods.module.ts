import { NgModule } from '@angular/core';
import { GoodsRoutingModule, goodsRoutedComponents, goodsPipes } from './goods-routing.module';
import { GoodsService } from './goods.service';
import { ThemeModule } from '../../../theme/theme.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AttributeService } from './attribute.service';

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
  ],
  providers: [
    GoodsService,
    AttributeService,
  ]
})
export class GoodsModule { }
