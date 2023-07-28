import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FileExplorerDialogComponent } from '../../../../components/file-explorer';

@Component({
    selector: 'app-disk-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit, AfterViewInit {

    @ViewChild(FileExplorerDialogComponent)
    public modal: FileExplorerDialogComponent

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.modal.open();
    }

}
