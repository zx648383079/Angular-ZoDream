import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-border-input',
    templateUrl: './border-input.component.html',
    styleUrls: ['./border-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => BorderInputComponent),
        multi: true
    }]
})
export class BorderInputComponent implements ControlValueAccessor {

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
