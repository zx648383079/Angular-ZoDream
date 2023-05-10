import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor-color',
  templateUrl: './editor-color.component.html',
  styleUrls: ['./editor-color.component.scss']
})
export class EditorColorComponent implements OnInit {

    public color = '';

    constructor() { }

    ngOnInit() {
    }

}
