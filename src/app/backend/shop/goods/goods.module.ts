import { NgModule } from '@angular/core';
import { GoodsRoutingModule, goodsRoutedComponents } from './goods-routing.module';
import { GoodsService } from './goods.service';
import { ThemeModule } from '../../../@theme/theme.module';

@NgModule({
  imports: [
    ThemeModule,
    GoodsRoutingModule
  ],
  declarations: [
    ...goodsRoutedComponents
  ],
  providers: [
    GoodsService
  ]
})
export class GoodsModule { }
