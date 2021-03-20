import {
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import { documentRoutedComponents, DocumentRoutingModule } from './document-routing.module';
import { DocumentService } from './document.service';
import { ThemeModule } from '../theme/theme.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DocumentRoutingModule
    ],
    declarations: [...documentRoutedComponents],
    providers: [
        DocumentService,
    ]
})
export class DocumentModule {}