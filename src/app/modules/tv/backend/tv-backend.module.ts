import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { backendRoutedComponents, BackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { TVService } from './tv.service';
import { DialogModule } from '../../../components/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZreEditorModule } from '../../../components/editor';
import { ZreFormModule } from '../../../components/form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        BackendRoutingModule,
        DialogModule,
        ReactiveFormsModule,
        NgSelectModule,
        ZreEditorModule,
        ZreFormModule,
    ],
    declarations: [...backendRoutedComponents],
    providers: [
        TVService
    ]
})
export class TvBackendModule { }
