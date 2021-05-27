import { Component } from '@angular/core';
import { IItem } from '../../../../theme/models/seo';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent {

    public value = '';

    public typeIndex = 0;

    public typeItems: IItem[] = [

    ];

    constructor() { }

    public tapType(i: number) {
        this.typeIndex = i;
    }
}
