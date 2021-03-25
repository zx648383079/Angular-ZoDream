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

@NgModule({
    imports: [
        CommonModule,
        DocumentBackendRoutingModule,
        ThemeModule,
        ReactiveFormsModule,
    ],
    declarations: [...documentBackendRoutedComponents],
    providers: [
        DocumentService,
    ]
})
export class DocumentBackendModule {}