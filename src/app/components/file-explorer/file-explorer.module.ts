import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerPanelComponent } from './panel/file-explorer-panel.component';
import { FileExplorerDialogComponent } from './dialog/file-explorer-dialog.component';
import { FILE_PROVIDER } from './model';
import { FileExplorerService } from './file-explorer.service';
import { FileExplorerCatalogComponent } from './catalog/file-explorer-catalog.component';
import { ThemeModule } from '../../theme/theme.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
    ],
    declarations: [
        FileExplorerPanelComponent, 
        FileExplorerDialogComponent,
        FileExplorerCatalogComponent
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
