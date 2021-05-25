import { NgModule } from '@angular/core';
import { GoodsRoutingModule, goodsRoutedComponents, goodsPipes } from './goods-routing.module';
import { GoodsService } from './goods.service';
import { ThemeModule } from '../../../theme/theme.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AttributeService } from './attribute.service';
import { SkuFormComponent } from './sku-form/sku-form.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { ZreFormModule } from '../../../form';

@NgModule({
    imports: [
        ThemeModule,
        NgbPaginationModule,
        GoodsRoutingModule,
        ReactiveFormsModule,
        EditorModule,
        ZreFormModule,
    ],
    declarations: [
        ...goodsRoutedComponents,
        ...goodsPipes,
        SkuFormComponent,
        SearchPanelComponent,
        SearchDialogComponent,
    ],
    providers: [
        GoodsService,
        AttributeService,
    ],
    exports: [
        SearchPanelComponent,
        SearchDialogComponent,
    ],
})
export class GoodsModule { }
