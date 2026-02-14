import { Component, viewChild } from '@angular/core';
import { FileExplorerDialogComponent } from '../../../../components/file-explorer';

@Component({
    standalone: false,
    selector: 'app-disk-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent {

    public readonly modal = viewChild(FileExplorerDialogComponent);


}
