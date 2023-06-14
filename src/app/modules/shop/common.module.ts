import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ZreFormModule } from '../../components/form';
import { ThemeModule } from '../../theme/theme.module';
import { BottomBarComponent, CartDialogComponent, CommentPageComponent, GallerySliderComponent, GoodsSliderComponent, IssuePageComponent, ShareDialogComponent, TopBarComponent } from './components';
import { PricePipe } from './pipes';


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
        FormsModule,
        ZreFormModule,
        ThemeModule,
    ],
    declarations: [...COMPONENTS, ...PIPES],
    exports: [
        ...COMPONENTS,
        ...PIPES,
    ]
})
export class ShopCommonModule { }