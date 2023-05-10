import { Component } from '@angular/core';

@Component({
  selector: 'app-editor-dropdown',
  templateUrl: './editor-dropdown.component.html',
  styleUrls: ['./editor-dropdown.component.scss']
})
export class EditorDropdownComponent {

    public items = [];

    constructor() {
        for (let i = 0; i < 5; i++) {
            this.items.push(i);
        }
    }

}
