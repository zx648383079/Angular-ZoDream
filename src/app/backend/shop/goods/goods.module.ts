import { NgModule } from '@angular/core';
import { GoodsRoutingModule, goodsRoutedComponents } from './goods-routing.module';
import { GoodsService } from './goods.service';
import { ThemeModule } from '../../../theme/theme.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ThemeModule,
    NgbPaginationModule,
    GoodsRoutingModule,
    ReactiveFormsModule,
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
