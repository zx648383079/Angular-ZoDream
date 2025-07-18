import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { warehouseRoutedComponents, WarehouseRoutingModule } from './warehouse-routing.routing';
import { ThemeModule } from '../../../../theme/theme.module';
import { WarehouseService } from './warehouse.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../../../components/dialog';
import { ZreFormModule } from '../../../../components/form';
import { ShopManageModule } from '../../components';
import { DesktopModule } from '../../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ReactiveFormsModule,
        WarehouseRoutingModule,
        ShopManageModule,
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...warehouseRoutedComponents],
    providers: [
        WarehouseService,
    ]
})
export class WarehouseModule { }
