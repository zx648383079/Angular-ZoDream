import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { IItem } from '../../../../../theme/models/seo';

@Component({
    selector: 'app-editor-icon-popup',
    templateUrl: './icon-popup.component.html',
    styleUrls: ['./icon-popup.component.scss'],
    host: {
        class: 'control-inline-group',
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorIconPopupComponent),
        multi: true
    }]
})
export class EditorIconPopupComponent implements ControlValueAccessor {

    @Input() public header: string = '';

    public items: IItem[] =  [
        {name: 'Home', value: 'icon-home'},
        {name: 'Edit', value: 'icon-edit'},
        {name: 'close', value: 'icon-times'},
        {name: 'trash', value: 'icon-trash'},
    ];

    public visible = false;
    public isEmpty = true;
    public disabled = false;
    private onChange: any = () => {};
    private onTouch: any = () => {};

    public tapSelect(item: IItem) {
        item.checked = true;
    }

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
