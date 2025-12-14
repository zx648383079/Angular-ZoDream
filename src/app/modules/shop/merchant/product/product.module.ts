import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule, productRoutingComponents } from './routing.module';
import { ThemeModule } from '../../../../theme/theme.module';
import { ZreFormModule } from '../../../../components/form';
import { DialogModule } from '../../../../components/dialog';
import { ShopManageModule } from '../../components';
import { ZreEditorModule } from '../../../../components/editor';
import { DesktopModule } from '../../../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        ZreFormModule,
        DesktopModule,
        DialogModule,
        ProductRoutingModule,
        ShopManageModule,
        ZreEditorModule,
    ],
    declarations: [...productRoutingComponents]
})
export class ProductModule { }
