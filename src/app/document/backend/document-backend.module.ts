import {
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    ThemeModule
} from '../../theme/theme.module';
import {
    ReactiveFormsModule
} from '@angular/forms';
import {
    DocumentBackendRoutingModule,
    documentBackendRoutedComponents,
} from './backend-routing.module';
import { DocumentService } from './document.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ZreEditorModule } from '../../editor/editor.module';
import { ContextMenuModule } from '../../context-menu/context-menu.module';
import { DialogModule } from '../../dialog';
import { ZreFormModule } from '../../form';

@NgModule({
    imports: [
        CommonModule,
        DocumentBackendRoutingModule,
        ThemeModule,
        NgbDropdownModule,
        ReactiveFormsModule,
        ZreEditorModule,
        ContextMenuModule,
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...documentBackendRoutedComponents],
    providers: [
        DocumentService,
    ]
})
export class DocumentBackendModule {}