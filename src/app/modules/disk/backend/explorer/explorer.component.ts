import { Component, OnInit, viewChild } from '@angular/core';
import { FileExplorerDialogComponent } from '../../../../components/file-explorer';

@Component({
    standalone: false,
    selector: 'app-disk-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

    public readonly modal = viewChild(FileExplorerDialogComponent);

    constructor() { }

    ngOnInit() {
    }

}
