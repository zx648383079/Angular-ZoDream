import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-editor-background-popup',
    templateUrl: './background-popup.component.html',
    styleUrls: ['./background-popup.component.scss'],
    host: {
        class: 'control-inline-group',
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorBackgroundPopupComponent),
        multi: true
    }]
})
export class EditorBackgroundPopupComponent implements ControlValueAccessor {

    @Input() public header: string = '';
    public visible = false;
    public isEmpty = true;
    public disabled = false;
    private onChange: any = () => {};
    private onTouch: any = () => {};

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
