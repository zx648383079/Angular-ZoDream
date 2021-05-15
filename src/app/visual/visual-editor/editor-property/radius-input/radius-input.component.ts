import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-radius-input',
    templateUrl: './radius-input.component.html',
    styleUrls: ['./radius-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RadiusInputComponent),
        multi: true
    }]
})
export class RadiusInputComponent implements ControlValueAccessor {

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
