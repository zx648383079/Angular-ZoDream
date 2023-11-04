import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';

@Component({
    selector: 'app-editor-select-input',
    templateUrl: './select-input.component.html',
    styleUrls: ['./select-input.component.scss'],
    host: {
        class: 'select-control-container',
    }
})
export class EditorSelectInputComponent {

    @Input() public editable = false;
    @Input() public searchable = false;
    @Input() public items: IItem[] = [];
    @Input() public arrowIcon = 'icon-chevron-down';

    public value = '';
    public visible = false;
    public isLoading = false;
    @HostBinding('class')
    public get ngClass() {
        return this.visible ? 'select-focus' : '';
    }

    constructor() { }

    public tapSelected(item: IItem) {

    }
}
