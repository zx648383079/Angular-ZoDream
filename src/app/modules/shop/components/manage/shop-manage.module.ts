import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryPanelComponent } from './gallery-panel/gallery-panel.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';
import { SkuFormComponent } from './sku-form/sku-form.component';
import { ZreFormModule } from '../../../../components/form';
import { DesktopModule } from '../../../../components/desktop';

const COMPONENTS = [
    GalleryPanelComponent,
    ProductDialogComponent,
    SearchDialogComponent,
    SearchPanelComponent,
    SkuFormComponent,
];

@NgModule({
    imports: [
        CommonModule,
        DesktopModule,
        ZreFormModule,
    ],
    declarations: [...COMPONENTS],
    exports: [
        ...COMPONENTS
    ]
})
export class ShopManageModule { }
