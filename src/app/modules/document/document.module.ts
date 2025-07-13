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
import { ZreFormModule } from '../../components/form';
import { ZreEditorModule } from '../../components/editor';
import { DesktopModule } from '../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        DocumentRoutingModule,
        DialogModule,
        ZreFormModule,
        ZreEditorModule,
    ],
    declarations: [...documentRoutedComponents],
    providers: [
        DocumentService,
    ]
})
export class DocumentModule {}