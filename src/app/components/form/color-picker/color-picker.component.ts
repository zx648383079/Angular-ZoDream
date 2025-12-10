import { Component, forwardRef, HostListener, output as output_1 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    standalone: false,
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ColorPickerComponent),
        multi: true
      }
  ]
})
export class ColorPickerComponent  {
    public disabled = true;
    public value = '';
    public visibility = false;

    public readonly valueChange = output<string>();

    onChange: any = () => { };
    onTouch: any = () => { };

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.color-picker') && !this.hasElementByClass(event.path, 'color-picker-calendar')) {
            this.visibility = false;
        }
    }

    constructor() { }

    public stopPropagation(e: MouseEvent) {
        e.stopPropagation();
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
        this.disabled = isDisabled;
    }

    public showPicker() {
        this.visibility = true;
    }

    private output() {
        this.visibility = false;
        this.onChange(this.value);
    }

    private hasElementByClass(path: Array<Element>, className: string): boolean {
        let hasClass = false;
        for (const item of path) {
            if (!item || !item.className) {
                continue;
            }
            hasClass = item.className.indexOf(className) >= 0;
            if (hasClass) {
                return true;
            }
        }
        return hasClass;
    }
}
