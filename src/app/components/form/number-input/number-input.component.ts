import { Component, computed, HostListener, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss'],
})
export class NumberInputComponent implements FormValueControl<number|string> {

    public readonly min = input(0);
    public readonly max = input(0);
    public readonly step = input(1);
    /**
     * 是否仅允许数字
     */
    public readonly only = input(true);
    public readonly disabled = input<boolean>(false);
    public readonly value = model<number|string>(1);

    public readonly minDisabled = computed(() => {
        if (this.disabled()) {
            return true;
        }
        return this.valueInt() <= this.min();
    });

    public readonly maxDisabled = computed(() => {
        if (this.disabled()) {
            return true;
        }
        return this.max() > 0 && this.valueInt() >= this.max();
    });

    public readonly valueInt = computed(() => {
        return this.parseInt(this.value());
    });

    @HostListener('wheel', ['$event'])
    public onWheel(e: WheelEvent) {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        e.preventDefault();
        if (e.deltaY < 0) {
            this.tapPlus();
        } else {
            this.tapMinus();
        }
    }

    public tapMinus() {
        if (this.minDisabled()) {
            return;
        }
        const step = this.step();
        this.tapChange(this.valueInt() - Math.max(typeof step === 'string' ? parseFloat(step) : step, 1));
    }

    public tapPlus() {
        if (this.maxDisabled()) {
            return;
        }
        const step = this.step();
        this.tapChange(this.valueInt() + Math.max(typeof step === 'string' ? parseFloat(step) : step, 1));
    }

    public onValueChange(e: Event) {
        const v = (e.target as HTMLInputElement).value;
        this.tapChange(this.parseInt(v), v);
    }

    public tapChange(i: number, format?: string) {
        if (this.disabled()) {
            return;
        }
        if (i < this.min()) {
            const min = this.min();
            i = typeof min === 'string' ? parseFloat(min) : min;
        } else if (this.max() > 0 && i > this.max()) {
            const max = this.max();
            i = typeof max === 'string' ? parseFloat(max) : max;
        }
        this.value.set(this.renderInt(i, format));
    }

    private parseInt(value: number|string) {
        if (!value) {
            return 0;
        }
        if (typeof value === 'number') {
            return value;
        }
        if (this.only()) {
            const v = parseFloat(value)
            return isNaN(v) ? 0 : v;
        }
        const match = value.match(/[\d.]+/);
        if (!match) {
            return 0;
        }
        const v = parseFloat(match[0]);
        return isNaN(v) ? 0 : v;
    }

    private renderInt(value: number, format = this.value()): number|string {
        if (this.only() || !format || typeof format === 'number') {
            return value;
        }
        const match = format.match(/[\d.]+/);
        if (!match) {
            return value + format;
        }
        return format.substring(0, match.index) + value + format.substring(match.index + match[0].length);
    }
}
