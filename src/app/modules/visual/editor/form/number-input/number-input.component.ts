import { Component, HostBinding, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'app-editor-number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss'],
    host: {
        class: 'select-with-control'
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorNumberInputComponent),
        multi: true
    }]
})
export class EditorNumberInputComponent implements ControlValueAccessor {

    @Input() public label = '';

    public unit = 'px';
    public visible = false;
    public unitItems: string[] = ['px', 'em', 'rem', 'vh', 'vw', '%', 'auto', 'none'];
    public disabled = false;
    private onChange: any = () => {};
    private onTouch: any = () => {};

    @HostBinding('class')
    public get ngClass() {
        return this.visible ? 'select-focus' : '';
    }

    public tapSelectedUnit(item: string) {
        this.unit = item;
        this.visible = false;
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
