import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../../../theme/services';

@Component({
  selector: 'app-editor-file',
  templateUrl: './editor-file.component.html',
  styleUrls: ['./editor-file.component.scss']
})
export class EditorFileComponent implements OnInit {

    public fileName = this.uploadService.uniqueGuid();
    constructor(
        private uploadService: FileUploadService,
    ) { }

    ngOnInit() {
    }

}
