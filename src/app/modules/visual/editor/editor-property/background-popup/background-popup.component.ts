import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor-background-popup',
  templateUrl: './background-popup.component.html',
  styleUrls: ['./background-popup.component.scss']
})
export class EditorBackgroundPopupComponent {

    public visible = false;
    public fileName = 'aaaaa';

    constructor() { }

    public uploadFile(e: any) {
        
    }
}
