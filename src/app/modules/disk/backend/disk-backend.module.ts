import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { diskBackendRoutingComponents, DiskBackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { DiskService } from './disk.service';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DiskBackendRoutingModule
    ],
    declarations: [
        ...diskBackendRoutingComponents,
    ],
    providers: [
        DiskService
    ]
})
export class DiskBackendModule { }
