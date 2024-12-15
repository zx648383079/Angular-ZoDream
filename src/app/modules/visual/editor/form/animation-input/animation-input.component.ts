import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { animationFuncOptions, animationIterationCountOptions, animationLabelDelayOptions, animationLabelDurationOptions, animationLabelOptions } from '../../model';
import { PropertyUtil } from '../../util';

@Component({
    standalone: false,
    selector: 'app-editor-animation-input',
    templateUrl: './animation-input.component.html',
    styleUrls: ['./animation-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorAnimationInputComponent),
        multi: true
    }]
})
export class EditorAnimationInputComponent implements ControlValueAccessor {

    public items = animationLabelOptions;
    public delayItems = animationLabelDelayOptions;
    public durationItems = animationLabelDurationOptions;
    public loopItems = animationIterationCountOptions;
    public funcItems = animationFuncOptions;

    public value = {
        name: '',
        duration: '',
        func: 'linear',
        delay: '',
        loop: '',
    };
    public disabled = false;
    private onChange: any = () => {};
    private onTouch: any = () => {};

    public get boxStyle() {
        return PropertyUtil.animation(this.value);
    }

    constructor() { }


    writeValue(obj: any): void {
        this.value = obj;
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
