import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { backendRoutedComponents, BackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { ResourceService } from './resource.service';
import { DialogModule } from '../../../components/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZreEditorModule } from '../../../components/editor';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        Field,
        BackendRoutingModule,
        DialogModule,
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
