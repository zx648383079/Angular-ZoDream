import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'app-editor-switch-input',
    templateUrl: './switch-input.component.html',
    styleUrls: ['./switch-input.component.scss'],
    host: {
        class: 'control-inline-group',
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorSwitchInputComponent),
        multi: true
    }]
})
export class EditorSwitchInputComponent implements ControlValueAccessor {

    @Input() public header: string = '';
    public value = false;
    public disabled = false;
    private onChange: any = () => {};
    private onTouch: any = () => {};

    public get isEmpty() {
        return !this.value;
    }

    public tapEmpty() {
        this.value = false;
    }
    
    writeValue(obj: any): void {
        this.value = !!obj;
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
