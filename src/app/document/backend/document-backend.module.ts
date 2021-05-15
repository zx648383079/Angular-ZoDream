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
import { ZoEditorModule } from '../../editor/editor.module';
import { ContextMenuModule } from '../../context-menu/context-menu.module';
import { DialogModule } from '../../dialog';

@NgModule({
    imports: [
        CommonModule,
        DocumentBackendRoutingModule,
        ThemeModule,
        NgbDropdownModule,
        ReactiveFormsModule,
        ZoEditorModule,
        ContextMenuModule,
        DialogModule,
    ],
    declarations: [...documentBackendRoutedComponents],
    providers: [
        DocumentService,
    ]
})
export class DocumentBackendModule {}