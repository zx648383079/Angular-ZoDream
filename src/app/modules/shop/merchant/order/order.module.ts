import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRoutingModule, orderRoutingComponents } from './routing.module';
import { ThemeModule } from '../../../../theme/theme.module';
import { DialogModule } from '../../../../components/dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        OrderRoutingModule,
        DialogModule,
    ],
    declarations: [...orderRoutingComponents]
})
export class OrderModule { }
