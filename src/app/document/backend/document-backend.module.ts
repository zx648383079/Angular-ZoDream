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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        DocumentBackendRoutingModule,
        ThemeModule,
        NgbModule,
        ReactiveFormsModule,
    ],
    declarations: [...documentBackendRoutedComponents],
    providers: [
        DocumentService,
    ]
})
export class DocumentBackendModule {}