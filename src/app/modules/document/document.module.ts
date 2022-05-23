import {
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import { documentRoutedComponents, DocumentRoutingModule } from './document-routing.module';
import { DocumentService } from './document.service';
import { ThemeModule } from '../../theme/theme.module';
import { DialogModule } from '../../components/dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DocumentRoutingModule,
        DialogModule,
    ],
    declarations: [...documentRoutedComponents],
    providers: [
        DocumentService,
    ]
})
export class DocumentModule {}