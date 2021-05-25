import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { warehouseRoutedComponents, WarehouseRoutingModule } from './warehouse-routing.routing';
import { ThemeModule } from '../../../theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseService } from './warehouse.service';
import { ReactiveFormsModule } from '@angular/forms';
import { GoodsModule } from '../goods/goods.module';
import { DialogModule } from '../../../dialog';
import { ZreFormModule } from '../../../form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NgbModule,
        ReactiveFormsModule,
        WarehouseRoutingModule,
        GoodsModule,
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...warehouseRoutedComponents],
    providers: [
        WarehouseService,
    ]
})
export class WarehouseModule { }
