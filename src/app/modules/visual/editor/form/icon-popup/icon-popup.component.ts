import { Component, input, model } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-icon-popup',
    templateUrl: './icon-popup.component.html',
    styleUrls: ['./icon-popup.component.scss'],
    host: {
        class: 'control-inline-group',
    },
})
export class EditorIconPopupComponent implements FormValueControl<string> {

    public readonly header = input<string>('');

    public items: IItem[] =  [
        {name: 'Home', value: 'icon-home'},
        {name: 'Edit', value: 'icon-edit'},
        {name: 'close', value: 'icon-times'},
        {name: 'trash', value: 'icon-trash'},
    ];

    public visible = false;
    public isEmpty = true;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    public tapSelect(item: IItem) {
        item.checked = true;
    }

    public tapEmpty() {

    }
    
}
