import { Component } from '@angular/core';

@Component({
  selector: 'app-editor-link',
  templateUrl: './editor-link.component.html',
  styleUrls: ['./editor-link.component.scss']
})
export class EditorLinkComponent {

    public url = '';
    public title = '';
    public isBlank = false;

    constructor() { }

}
