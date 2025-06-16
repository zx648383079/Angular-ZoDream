import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'app-letter-input',
    templateUrl: './letter-input.component.html',
    styleUrls: ['./letter-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => LetterInputComponent),
        multi: true
    }]
})
export class LetterInputComponent implements ControlValueAccessor, OnChanges {

    @Input() public length = 4;
    public items: string[] = ['', '', '', ''];
    public value = '';
    public disabled = false;
    public isEnabled = false;

    onChange: any = () => {};
    onTouch: any = () => {};

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.length) {
            this.items = Array.from({length: changes.length.currentValue}, _ => '');
        }
    }

    public onValueChanged() {
        this.refresh();
        if (this.value.length == this.length) 
        {
            this.onChange(this.value);
        }
    }

    public onFocus() {
        this.isEnabled = true;
        this.onTouch();
    }

    public onBlur() {
        this.isEnabled = false;
        this.onTouch();
    }

    private refresh() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i] = i >= this.value.length ? '' : this.value.charAt(i);
        }
    }

    writeValue(obj: any): void {
        this.value = !obj ? '' : obj;
        this.refresh();
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
