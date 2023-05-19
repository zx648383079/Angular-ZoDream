import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule, productRoutingComponents } from './routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../../../theme/theme.module';
import { ZreFormModule } from '../../../../components/form';
import { DialogModule } from '../../../../components/dialog';
import { ShopManageModule } from '../../components';
import { ZreHtmlEditorModule } from '../../../../components/editor';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ThemeModule,
        ZreFormModule,
        DialogModule,
        ProductRoutingModule,
        ShopManageModule,
        ReactiveFormsModule,
        ZreHtmlEditorModule,
    ],
    declarations: [...productRoutingComponents]
})
export class ProductModule { }
