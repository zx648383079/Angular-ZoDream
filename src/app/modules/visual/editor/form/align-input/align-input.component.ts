import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'app-editor-align-input',
    templateUrl: './align-input.component.html',
    styleUrls: ['./align-input.component.scss'],
    host: {
        class: 'control-line-group',
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorAlignInputComponent),
        multi: true
    }]
})
export class EditorAlignInputComponent implements ControlValueAccessor {

    @Input() public header: string = '';
    public isEmpty = true;
    public disabled = false;
    private onChange: any = () => {};
    private onTouch: any = () => {};

    constructor() { }

    public tapEmpty() {

    }
    
    writeValue(obj: any): void {
        
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
