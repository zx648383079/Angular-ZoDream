import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule, productRoutingComponents } from './routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../../../theme/theme.module';
import { ZreFormModule } from '../../../../components/form';
import { DialogModule } from '../../../../components/dialog';
import { ShopManageModule } from '../../components';
import { ZreEditorModule } from '../../../../components/editor';
import { DesktopModule } from '../../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ThemeModule,
        ZreFormModule,
        DesktopModule,
        DialogModule,
        ProductRoutingModule,
        ShopManageModule,
        ReactiveFormsModule,
        ZreEditorModule,
    ],
    declarations: [...productRoutingComponents]
})
export class ProductModule { }
