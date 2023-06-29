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
    ReactiveFormsModule
} from '@angular/forms';
import {
    DocumentBackendRoutingModule,
    documentBackendRoutedComponents,
} from './backend-routing.module';
import { DocumentService } from './document.service';
import { ZreEditorModule } from '../../../components/editor';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { DocumentSharedModule } from '../shared';

@NgModule({
    imports: [
        CommonModule,
        DocumentBackendRoutingModule,
        ThemeModule,
        ReactiveFormsModule,
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