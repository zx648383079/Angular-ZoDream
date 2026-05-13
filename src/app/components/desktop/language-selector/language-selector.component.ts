import { Component, ElementRef, forwardRef, HostListener, inject, input, model, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { isParentOf } from '../../../theme/utils/doc';
import { IItem } from '../../../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-language-selector',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./language-selector.component.scss'],
    host: {
        'class': 'select-input-container',
        '[class.--with-open]': 'panelVisible()',
        '[class.--with-flow-top]': 'flowTop()',
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => LanguageSelectorComponent),
        multi: true
    }]
})
export class LanguageSelectorComponent implements FormValueControl<string|undefined> {

    private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);

    public readonly placeholder = input($localize `Current Language`);
    public readonly items = input.required<IItem[]>();
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>();
    public readonly panelVisible = signal(false);
    public readonly flowTop = signal(false);
    private changeFn: any = () => {};

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: MouseEvent) {
        if (isParentOf(event.target as Node, this.elementRef.nativeElement) < 0) {
            this.panelVisible.set(false);
        }
    }


    public tapSelected(index: number) {
        if (this.disabled()) {
            return;
        }
        const item = this.items()[index];
        this.value.set(item.value);
        this.changeFn(item.value);
        this.panelVisible.set(false);
    }

    public onFocus() {
        const offset = this.elementRef.nativeElement.getBoundingClientRect();
        this.flowTop.set(offset.top < 0 || offset.bottom > window.innerHeight - 320);
        this.panelVisible.set(true);
    }

    writeValue(obj: any): void {
        this.value.set(obj);
    }

    registerOnChange(fn: any): void {
        this.changeFn = fn;
    }
    registerOnTouched(fn: any): void {}
    setDisabledState?(isDisabled: boolean): void {}
}
