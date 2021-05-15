import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-shadow-input',
    templateUrl: './shadow-input.component.html',
    styleUrls: ['./shadow-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ShadowInputComponent),
        multi: true
    }]
})
export class ShadowInputComponent implements ControlValueAccessor {

    public value: any;
    public disabled = false;
    private onChange: any = () => {};
    private onTouch: any = () => {};

    constructor() { }


    writeValue(obj: any): void {
        this.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

}
