import { NgModule } from '@angular/core';
import { GoodsRoutingModule, goodsRoutedComponents } from './goods-routing.module';
import { GoodsService } from './goods.service';
import { ThemeModule } from '../../../theme/theme.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  imports: [
    ThemeModule,
    NgbPaginationModule,
    GoodsRoutingModule,
    EditorModule,
  ],
  declarations: [
    ...goodsRoutedComponents
  ],
  providers: [
    GoodsService
  ]
})
export class GoodsModule { }
