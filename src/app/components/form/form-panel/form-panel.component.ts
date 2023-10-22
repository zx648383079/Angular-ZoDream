import { Component, Input } from '@angular/core';
import { IFormInput, FormPanelEvent } from '../event';

@Component({
    selector: 'app-form-panel',
    templateUrl: './form-panel.component.html',
    styleUrls: ['./form-panel.component.scss']
})
export class FormPanelComponent implements FormPanelEvent {

    @Input() public items: IFormInput[] = [];

    public get valid(): boolean {
        return !this.invalid;
    }
    public get invalid(): boolean {
        for (const item of this.items) {
            if (item.required && !item.value) {
                return true;
            }
        }
        return false;
    }

    public get value(): any {
        const data: any = {};
        for (const item of this.items) {
            data[item.name] = item.value;
        }
        return data;
    }

}
