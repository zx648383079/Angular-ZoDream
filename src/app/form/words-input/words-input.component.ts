import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { eachObject } from '../../theme/utils';

@Component({
    selector: 'app-words-input',
    templateUrl: './words-input.component.html',
    styleUrls: ['./words-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => WordsInputComponent),
        multi: true
    }]
})
export class WordsInputComponent implements ControlValueAccessor {

    @ViewChild('inputBox')
    private inputBoxRef: ElementRef<HTMLInputElement>;

    @Input() public placeholder = $localize `Please input...`;
    @Input() public join = ',';
    
    public value: string[] | number | string;
    public disabled = false;
    public selectedItems: string[] = [];
    public keywords = '';

    onChange: any = () => {};
    onTouch: any = () => {};

    constructor() { }

    private output() {
        this.value = this.join ? this.selectedItems.join(this.join) : {...this.selectedItems};
        this.onChange(this.value);
    }

    public tapUnselect(v: string) {
        for (let i = this.selectedItems.length - 1; i >= 0; i--) {
            if (this.selectedItems[i] === v) {
                this.selectedItems.splice(i, 1);
            }
        }
        this.output();
    }

    public tapEdit(item: string) {
        this.keywords = item;
        for (let i = this.selectedItems.length - 1; i >= 0; i--) {
            if (this.selectedItems[i] == item) {
                this.selectedItems.splice(i, 1);
            }
        }
        this.inputBoxRef.nativeElement?.focus();
    }

    public onKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            this.onBlur();
        }
    }

    public onBlur() {
        this.push(this.keywords);
        this.keywords = '';
        this.output();
    }

    public push(v: any) {
        if (v === null || v === undefined || v === '') {
            return;
        }
        if (typeof v !== 'string') {
            v = `${v}`;
        }
        v = v.trim();
        if (this.selectedItems.indexOf(v) >= 0) {
            return;
        }
        this.selectedItems.push(v);
    }

    writeValue(obj: any): void {
        this.value = obj;
        this.selectedItems = [];
        if (typeof obj === 'undefined' || obj === null) {
            return;
        }
        if (typeof obj == 'object') {
            eachObject(obj, v => {
                this.push(v);
            });
            return;
        }
        if (!this.join || typeof obj !== 'string') {
            this.push(obj);
            return;
        }
        obj.split(this.join).forEach(v => {
            this.push(v);
        });
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
