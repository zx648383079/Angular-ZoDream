import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BottomBarComponent, CartDialogComponent, GallerySliderComponent, GoodsSliderComponent, TopBarComponent } from './components';


const COMPONENTS = [
    TopBarComponent,
    BottomBarComponent,
    CartDialogComponent,
    GoodsSliderComponent,
    GallerySliderComponent,
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
    ],
    declarations: [...COMPONENTS],
    exports: [
        ...COMPONENTS,
    ]
})
export class ShopCommonModule { }