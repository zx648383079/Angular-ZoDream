import { Component, HostBinding, input, model, signal } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-select-input',
    templateUrl: './select-input.component.html',
    styleUrls: ['./select-input.component.scss'],
    host: {
        class: 'control-line-group',
    },
})
export class EditorSelectInputComponent implements FormValueControl<string> {

    public readonly editable = input(false);
    public readonly searchable = input(false);
    public readonly items = input<IItem[]>([]);
    public readonly arrowIcon = input('icon-chevron-down');
    
    public readonly header = input<string>('');

    public readonly visible = signal(false);
    public readonly isLoading = signal(false);

    public isEmpty = true;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    @HostBinding('class')
    public get ngClass() {
        return this.visible ? 'select-focus' : '';
    }

    public toggle() {
        this.visible.update(v => !v);
    }

    public tapSelected(item: IItem) {

    }
    
    public tapEmpty() {

    }
    
}
