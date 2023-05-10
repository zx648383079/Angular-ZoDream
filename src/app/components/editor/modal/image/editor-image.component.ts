import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../../../theme/services';

@Component({
  selector: 'app-editor-image',
  templateUrl: './editor-image.component.html',
  styleUrls: ['./editor-image.component.scss']
})
export class EditorImageComponent implements OnInit {

    public fileName = this.uploadService.uniqueGuid();
    public tabIndex = 0;
    public url = '';
    constructor(
        private uploadService: FileUploadService,
    ) { }

    ngOnInit() {
    }

}
