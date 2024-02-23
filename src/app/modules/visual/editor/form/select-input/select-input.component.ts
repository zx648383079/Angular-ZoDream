import { Component, HostBinding, Input, OnInit, forwardRef } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-editor-select-input',
    templateUrl: './select-input.component.html',
    styleUrls: ['./select-input.component.scss'],
    host: {
        class: 'control-line-group',
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorSelectInputComponent),
        multi: true
    }]
})
export class EditorSelectInputComponent implements ControlValueAccessor {

    @Input() public editable = false;
    @Input() public searchable = false;
    @Input() public items: IItem[] = [];
    @Input() public arrowIcon = 'icon-chevron-down';
    
    @Input() public header: string = '';

    public value = '';
    public visible = false;
    public isLoading = false;

    public isEmpty = true;
    public disabled = false;
    private onChange: any = () => {};
    private onTouch: any = () => {};

    @HostBinding('class')
    public get ngClass() {
        return this.visible ? 'select-focus' : '';
    }

    constructor() { }

    public tapSelected(item: IItem) {

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
