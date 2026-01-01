import { Component, computed, signal } from '@angular/core';
import { FormPanelEvent, IFormInput } from '../../form';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'app-form-panel',
    templateUrl: './form-panel.component.html',
    styleUrls: ['./form-panel.component.scss']
})
export class FormPanelComponent implements FormPanelEvent {

    public readonly items = signal<IFormInput[]>([]);

    public readonly form = computed(() => {
        const items = this.items();
        const groups: any = {};
        for (const item of items) {
            const val = typeof item.value === 'undefined' ? '' : item.value;
            groups[item.name] = item.required ? new FormControl(val, Validators.required) 
            : new FormControl(val);
        }
        return new FormGroup(groups);
    });

    public readonly valid = computed(() => {
        return this.form().valid;
    });
    public readonly invalid = computed(() => {
        return !this.valid();
    });

    public readonly value = computed(() => {
        return this.form().getRawValue();
    });
}
