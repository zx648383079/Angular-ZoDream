import { NgModule } from '@angular/core';
import { GoodsRoutingModule, goodsRoutedComponents, goodsPipes } from './goods-routing.module';
import { GoodsService } from './goods.service';
import { ThemeModule } from '../../../../theme/theme.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AttributeService } from './attribute.service';
import { ZreFormModule } from '../../../../components/form';
import { DialogModule } from '../../../../components/dialog';
import { ZreHtmlEditorModule } from '../../../../components/editor';
import { ShopManageModule } from '../../components';

@NgModule({
    imports: [
        ThemeModule,
        NgbPaginationModule,
        GoodsRoutingModule,
        ReactiveFormsModule,
        ZreHtmlEditorModule,
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
