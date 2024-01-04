import { Component, Input, forwardRef } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-editor-border-popup',
    templateUrl: './border-popup.component.html',
    styleUrls: ['./border-popup.component.scss'],
    host: {
        class: 'control-inline-group',
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorBorderPopupComponent),
        multi: true
    }]
})
export class EditorBorderPopupComponent implements ControlValueAccessor {

    @Input() public header: string = '';
    public visible = false;

    public styleItems: IItem[] = [
        {name: '无', value: ''},
        {name: '横线', value: 'solid'},
        {name: '点线', value: 'dotted'},
        {name: '虚线', value: 'double'},
    ]
  
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
