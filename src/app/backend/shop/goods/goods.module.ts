import { NgModule } from '@angular/core';
import { GoodsRoutingModule, goodsRoutedComponents } from './goods-routing.module';
import { GoodsService } from './goods.service';
import { ThemeModule } from '../../../theme/theme.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    ThemeModule,
    NgbPaginationModule,
    GoodsRoutingModule,
  ],
  declarations: [
    ...goodsRoutedComponents
  ],
  providers: [
    GoodsService
  ]
})
export class GoodsModule { }
