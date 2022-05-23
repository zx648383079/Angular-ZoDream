import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { waiterRoutingComponents, WaiterRoutingModule } from './waiter-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        WaiterRoutingModule
    ],
    declarations: [...waiterRoutingComponents]
})
export class WaiterModule { }
