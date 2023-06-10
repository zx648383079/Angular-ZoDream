import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { cateringBackendRoutingComponents, CateringBackendRoutingModule } from './backend-routing.module';

@NgModule({
    imports: [
        CommonModule,
        CateringBackendRoutingModule,
        ThemeModule,
        ReactiveFormsModule,
    ],
    declarations: [...cateringBackendRoutingComponents]
})
export class CateringBackendModule { }
