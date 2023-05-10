import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../../../theme/services';

@Component({
  selector: 'app-editor-video',
  templateUrl: './editor-video.component.html',
  styleUrls: ['./editor-video.component.scss']
})
export class EditorVideoComponent implements OnInit {

    public fileName = this.uploadService.uniqueGuid();
    public tabIndex = 0;
    public url = '';
    public code = '';
    public isAutoplay = false;
    constructor(
        private uploadService: FileUploadService,
    ) { }

    ngOnInit() {
    }

}
