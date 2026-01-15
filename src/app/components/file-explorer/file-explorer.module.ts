import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerPanelComponent } from './panel/file-explorer-panel.component';
import { FileExplorerDialogComponent } from './dialog/file-explorer-dialog.component';
import { FILE_PROVIDER } from './model';
import { FileExplorerService } from './file-explorer.service';
import { FileExplorerCatalogComponent } from './catalog/file-explorer-catalog.component';
import { FileExplorerImageEditorComponent } from './tools';
import { DesktopModule } from '../desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        FormField,
        DesktopModule,
    ],
    declarations: [
        FileExplorerPanelComponent, 
        FileExplorerDialogComponent,
        FileExplorerCatalogComponent,
        FileExplorerImageEditorComponent,
    ],
    exports: [FileExplorerDialogComponent],
    providers: [
        {
            provide: FILE_PROVIDER,
            useClass: FileExplorerService
        }
    ]
})
export class FileExplorerModule { }
