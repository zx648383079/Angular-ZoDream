import { Component, effect, input, model } from '@angular/core';
import { parseNumber } from '../../../theme/utils';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-data-size',
    templateUrl: './data-size.component.html',
    styleUrls: ['./data-size.component.scss'],
})
export class DataSizeComponent implements FormValueControl<string|number> {

    public readonly placeholder = input($localize `Please input`);
    public readonly unitItems = input(['B', 'KB', 'MB', 'GB', 'TB', 'PB']);
    public readonly unitBase = input(1024);
    public unitIndex = 0;
    public unitValue: any = 0;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string|number>(0);
    private formattedValue = 0;

    constructor() {
        effect(() => this.writeValue(this.value()));
    }

    public onValueChange() {
        this.value.set(Math.pow(this.unitBase(), this.unitIndex) * parseNumber(this.unitValue));
    }

    public onUnitChange() {
        this.unitValue = this.formatFloat(this.formattedValue / Math.pow(this.unitBase(), this.unitIndex), 2);
    }

    private formatFloat(src: number, pos: number) {
        return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    }

    private formatUnit(val: number): number {
        let i = 0;
        let diff = val;
        while (diff > this.unitBase()) {
            i ++;
            diff /= this.unitBase();
        }
        return i;
    } 

    writeValue(obj: any): void {
        const oldVal = this.formattedValue;
        this.formattedValue = parseNumber(obj);
        if (oldVal === 0 && this.formattedValue > 0) {
            this.unitIndex = this.formatUnit(this.formattedValue);
        }
        this.onUnitChange();
    }
}
