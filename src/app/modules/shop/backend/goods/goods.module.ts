import { NgModule } from '@angular/core';
import { GoodsRoutingModule, goodsRoutedComponents, goodsPipes } from './goods-routing.module';
import { GoodsService } from './goods.service';
import { ThemeModule } from '../../../../theme/theme.module';
import { AttributeService } from './attribute.service';
import { ZreFormModule } from '../../../../components/form';
import { DialogModule } from '../../../../components/dialog';
import { ZreEditorModule } from '../../../../components/editor';
import { ShopManageModule } from '../../components';
import { DesktopModule } from '../../../../components/desktop';

@NgModule({
    imports: [
        ThemeModule,
        DesktopModule,
        GoodsRoutingModule,
        ZreEditorModule,
        DialogModule,
        ZreFormModule,
        ShopManageModule,
    ],
    declarations: [
        ...goodsRoutedComponents,
        ...goodsPipes,
    ],
    providers: [
        GoodsService,
        AttributeService,
    ],
})
export class GoodsModule { }
