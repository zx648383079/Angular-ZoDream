import { Component, HostListener, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { hasElementByClass } from '../../../theme/utils/doc';

@Component({
    standalone: false,
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements FormValueControl<string>  {
    public readonly disabled = input(true);
    public readonly value = model('');
    public visibility = false;
    
    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.color-picker') && !hasElementByClass(event.path, 'color-picker-calendar')) {
            this.visibility = false;
        }
    }

    constructor() { }

    public stopPropagation(e: MouseEvent) {
        e.stopPropagation();
    }

    public showPicker() {
        this.visibility = true;
    }

    private output() {
        this.visibility = false;
    }
}
