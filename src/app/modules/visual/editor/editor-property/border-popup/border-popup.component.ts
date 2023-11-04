import { Component, OnInit } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';

@Component({
    selector: 'app-editor-border-popup',
    templateUrl: './border-popup.component.html',
    styleUrls: ['./border-popup.component.scss']
})
export class EditorBorderPopupComponent {

    public visible = false;

    public styleItems: IItem[] = [
        {name: '无', value: ''},
        {name: '横线', value: 'solid'},
        {name: '点线', value: 'dotted'},
        {name: '虚线', value: 'double'},
    ]
    constructor() { }

}
