import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { backendRoutedComponents, BackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { TVService } from './tv.service';
import { DialogModule } from '../../../components/dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        BackendRoutingModule,
        DialogModule,
    ],
    declarations: [...backendRoutedComponents],
    providers: [
        TVService
    ]
})
export class TvBackendModule { }
