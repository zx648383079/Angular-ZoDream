import {
    Component,
    forwardRef,
    Input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-star',
    templateUrl: './star.component.html',
    styleUrls: ['./star.component.scss'],
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => StarComponent),
          multi: true
        }
    ]
})
export class StarComponent {

    @Input() public disable = true;
    public value = 10;
    public items = [2, 4, 6, 8, 10];

    onChange: any = () => { };
    onTouch: any = () => { };

    constructor() {}

    public tapChange(i: number) {
        if (this.disable) {
            return;
        }
        this.value = i;
        this.onChange(this.value);
    }

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
        this.disable = isDisabled;
    }
}