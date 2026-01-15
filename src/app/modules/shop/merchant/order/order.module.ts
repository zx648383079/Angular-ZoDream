import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRoutingModule, orderRoutingComponents } from './routing.module';
import { ThemeModule } from '../../../../theme/theme.module';
import { DialogModule } from '../../../../components/dialog';
import { DesktopModule } from '../../../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        OrderRoutingModule,
        DialogModule,
    ],
    declarations: [...orderRoutingComponents]
})
export class OrderModule { }
