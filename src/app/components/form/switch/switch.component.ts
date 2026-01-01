import {
  Component,
  computed,
  forwardRef,
  input,
  model
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { parseNumber } from '../../../theme/utils';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SwitchComponent),
        multi: true
    }]
})
export class SwitchComponent implements ControlValueAccessor, FormValueControl<boolean|number|string> {


    public readonly label = input('');
    public readonly offLabel = input('');
    public readonly onLabel = input('');

    public readonly value = model<boolean|number|string>(false);
    public readonly disabled = input(false);

    private changeFn: any = () => {};

    public readonly labelContent = computed(() => {
        if (this.isActive()) {
            return this.onLabel() || this.label();
        }
        return this.offLabel() || this.label();
    });

    public readonly isActive = computed(() => {
        const value = this.value();
        if (typeof value === 'boolean') {
            return value;
        }
        return parseNumber(value) > 0;
    });

    public tapToggle() {
        if (this.disabled()) {
            return;
        }
        this.value.update(v => {
            if (typeof v === 'boolean') {
                return !v;
            }
            return parseNumber(v) > 0 ? 0 : 1;
        });
        this.changeFn(this.value());
    }


    writeValue(obj: any): void {
        this.value.set(obj);
    }
    registerOnChange(fn: any): void {
        this.changeFn = fn;
    }
    registerOnTouched(fn: any): void {}
    setDisabledState?(isDisabled: boolean): void {}
}
