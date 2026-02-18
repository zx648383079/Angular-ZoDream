import { Component, effect, HostListener, input, model, signal } from '@angular/core';
import { parseNumber } from '../../../theme/utils';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-data-size',
    templateUrl: './data-size.component.html',
    styleUrls: ['./data-size.component.scss'],
    host: {
        class: 'data-size-input'
    }
})
export class DataSizeComponent implements FormValueControl<string|number> {

    public readonly placeholder = input($localize `Please input`);
    public readonly unitItems = input(['B', 'KB', 'MB', 'GB', 'TB', 'PB']);
    public readonly unitBase = input(1024);
    public readonly unitIndex = signal(0);
    public readonly unitValue = signal(0);
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string|number>(0);
    private formattedValue = 0;

    constructor() {
        effect(() => this.writeValue(this.value()));
    }

    @HostListener('wheel', ['$event'])
    public onWheel(e: WheelEvent) {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        e.preventDefault();
        this.unitValue.update(v => {
            if (e.deltaY > 0) {
                return v - 1;
            } else {
                return v + 1;
            }
        });
        this.value.set(Math.pow(this.unitBase(), this.unitIndex()) * this.unitValue());
    }

    public onValueChange(val: number|string) {
        this.unitValue.set(parseNumber(val));
        this.value.set(Math.pow(this.unitBase(), this.unitIndex()) * this.unitValue());
    }

    public onUnitChange(e: Event) {
        this.unitIndex.set(parseNumber((e.target as HTMLSelectElement).value));
        this.unitValue.set(this.formatFloat(this.formattedValue / Math.pow(this.unitBase(), this.unitIndex()), 2));
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
            this.unitIndex.set(this.formatUnit(this.formattedValue));
        }
        this.unitValue.set(this.formatFloat(this.formattedValue / Math.pow(this.unitBase(), this.unitIndex()), 2));
    }
}
