import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'app-editor-number-slider-input',
    templateUrl: './number-slider-input.component.html',
    styleUrls: ['./number-slider-input.component.scss']
})
export class EditorNumberSliderInputComponent implements ControlValueAccessor {

    @Input() public header: string = '';
    @Input() public hasUnit = true;
    public isEmpty = false;
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
