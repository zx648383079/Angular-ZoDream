import { Component, input, model, signal } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-border-popup',
    templateUrl: './border-popup.component.html',
    styleUrls: ['./border-popup.component.scss'],
    host: {
        class: 'control-inline-group',
    },
})
export class EditorBorderPopupComponent implements FormValueControl<string> {

    public readonly header = input<string>('');
    public readonly visible = signal(false);

    public styleItems: IItem[] = [
        {name: '无', value: ''},
        {name: '横线', value: 'solid'},
        {name: '点线', value: 'dotted'},
        {name: '虚线', value: 'double'},
    ]
  
    public isEmpty = true;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    public toggle() {
        this.visible.update(v => !v);
    }

    public tapEmpty() {

    }
    

}
