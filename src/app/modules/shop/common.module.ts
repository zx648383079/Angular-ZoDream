import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZreFormModule } from '../../components/form';
import { BottomBarComponent, CartDialogComponent, CommentPageComponent, GallerySliderComponent, GoodsSliderComponent, IssuePageComponent, ShareDialogComponent, TopBarComponent } from './components';
import { PricePipe } from './pipes';
import { DesktopModule } from '../../components/desktop';
import { FormField } from '@angular/forms/signals';


const COMPONENTS = [
    TopBarComponent,
    BottomBarComponent,
    CartDialogComponent,
    GoodsSliderComponent,
    GallerySliderComponent,
    CommentPageComponent,
    IssuePageComponent,
    ShareDialogComponent,
];

const PIPES = [
    PricePipe,
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgOptimizedImage,
        FormField,
        ZreFormModule,
        DesktopModule,
    ],
    declarations: [...COMPONENTS, ...PIPES],
    exports: [
        ...COMPONENTS,
        ...PIPES,
    ]
})
export class ShopCommonModule { }