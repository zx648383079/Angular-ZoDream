import {
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    ThemeModule
} from '../../../theme/theme.module';
import {
    DocumentBackendRoutingModule,
    documentBackendRoutedComponents,
} from './backend-routing.module';
import { DocumentService } from './document.service';
import { ZreEditorModule } from '../../../components/editor';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { DocumentSharedModule } from '../shared';
import { DesktopModule } from '../../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        Field,
        DocumentBackendRoutingModule,
        ThemeModule,
        DesktopModule,
        ZreEditorModule,
        DocumentSharedModule,
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...documentBackendRoutedComponents],
    providers: [
        DocumentService,
    ]
})
export class DocumentBackendModule {}