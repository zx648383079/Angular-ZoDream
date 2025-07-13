import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { backendRoutedComponents, BackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { ResourceService } from './resource.service';
import { DialogModule } from '../../../components/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZreEditorModule } from '../../../components/editor';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        BackendRoutingModule,
        DialogModule,
        ReactiveFormsModule,
        NgSelectModule,
        ZreEditorModule,
        ZreFormModule,
    ],
    declarations: [...backendRoutedComponents],
    providers: [
        ResourceService
    ]
})
export class ResourceBackendModule { }
