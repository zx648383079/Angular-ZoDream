import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-side-select',
    templateUrl: './side-select.component.html',
    styleUrls: ['./side-select.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SideSelectComponent),
        multi: true
    }]
})
export class SideSelectComponent implements ControlValueAccessor {

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
