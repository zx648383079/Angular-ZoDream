import { Component, ElementRef, HostListener, inject, input, model, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { isParentOf } from '../../../theme/utils/doc';

@Component({
    standalone: false,
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements FormValueControl<string>  {

    private readonly elementRef = inject(ElementRef);

    public readonly disabled = input(true);
    public readonly value = model('');
    public readonly visible = signal(false);
    
    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: MouseEvent) {
        if (isParentOf(event.target as Node, this.elementRef.nativeElement) < 0) {
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
