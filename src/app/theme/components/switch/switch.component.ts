import {
    Component,
    forwardRef,
    Input
} from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SwitchComponent),
        multi: true
    }]
})
export class SwitchComponent implements ControlValueAccessor {

    @Input() public label = '';

    public value: boolean | number = false;
    public disable = false;

    onChange: any = () => {};
    onTouch: any = () => {};

    public get isActive(): boolean {
        if (typeof this.value === 'boolean') {
            return this.value;
        }
        return this.value > 0;
    }

    public tapToggle() {
        if (this.disable) {
            return;
        }
        if (typeof this.value === 'boolean') {
            this.onChange(this.value = !this.value);
            return;
        }
        this.onChange(this.value = this.value > 0 ? 0 : 1);
    }

    writeValue(obj: any): void {
        this.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState ? (isDisabled: boolean) : void {
        this.disable = isDisabled;
    }

}