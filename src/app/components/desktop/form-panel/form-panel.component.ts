import { Component, computed, signal } from '@angular/core';
import { FormPanelEvent, IFormInput } from '../../form';

@Component({
    standalone: false,
    selector: 'app-form-panel',
    templateUrl: './form-panel.component.html',
    styleUrls: ['./form-panel.component.scss']
})
export class FormPanelComponent implements FormPanelEvent {

    public readonly items = signal<IFormInput[]>([]);

    public readonly valid = computed(() => {
        return !this.invalid;
    });
    public readonly invalid = computed(() => {
        for (const item of this.items()) {
            if (item.required && !item.value) {
                return true;
            }
        }
        return false;
    });

    public readonly value = computed(() => {
        const data: any = {};
        for (const item of this.items()) {
            data[item.name] = item.value;
        }
        return data;
    });

}
