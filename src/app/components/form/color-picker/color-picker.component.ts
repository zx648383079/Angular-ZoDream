import { Component, HostListener, input, model, signal } from '@angular/core';
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
    public readonly visible = signal(false);
    
    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.color-picker') && !hasElementByClass(event.path, 'color-picker-calendar')) {
            this.visible.set(false);
        }
    }

    public stopPropagation(e: MouseEvent) {
        e.stopPropagation();
    }

    public open() {
        this.visible.set(true);
    }
}
