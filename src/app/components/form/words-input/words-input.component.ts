import { Component, effect, ElementRef, input, model, signal, viewChild } from '@angular/core';
import { eachObject } from '../../../theme/utils';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-words-input',
    templateUrl: './words-input.component.html',
    styleUrls: ['./words-input.component.scss'],
    host: {
        class: 'words-input',
        '[class.--with-focus]': 'isFocus()',
    }
})
export class WordsInputComponent implements FormValueControl<string[] | number | string> {

    private readonly inputBoxRef = viewChild<ElementRef<HTMLInputElement>>('inputBox');

    public readonly placeholder = input($localize `Please input...`);
    public readonly join = input(',');
    
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string[] | number | string>('');
    public readonly selectedItems = signal<string[]>([]);
    public readonly keywords = signal('');
    public readonly isFocus = signal(false);

    constructor() {
        effect(() => this.writeValue(this.value()));
    }

    private output() {
        const join = this.join();
        this.value.set(join ? this.selectedItems().join(join) : {...this.selectedItems()});
    }

    public tapUnselect(val: string) {
        this.selectedItems.update(v => {
            return v.filter(i => i !== val);
        });
        this.output();
    }

    public tapEdit(item: string) {
        this.keywords.set(item);
        this.selectedItems.update(v => {
            return v.filter(i => i !== item);
        });
        this.inputBoxRef().nativeElement?.focus();
    }

    public onKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            this.onBlur();
        }
    }

    public onBlur() {
        this.isFocus.set(false);
        this.push(this.keywords());
        this.keywords.set('');
        this.output();
    }

    public push(val: any) {
        if (val === null || val === undefined || val === '') {
            return;
        }
        if (typeof val !== 'string') {
            val = `${val}`;
        }
        val = val.trim();
        this.selectedItems.update(v => {
            if (v.indexOf(val) < 0) {
                v.push(val);
            }
            return [...v];
        });
    }

    private writeValue(obj: any): void {
        this.selectedItems.set([]);
        if (typeof obj === 'undefined' || obj === null) {
            return;
        }
        if (typeof obj == 'object') {
            eachObject(obj, v => {
                this.push(v);
            });
            return;
        }
        const join = this.join();
        if (!join || typeof obj !== 'string') {
            this.push(obj);
            return;
        }
        obj.split(join).forEach(v => {
            this.push(v);
        });
    }
}
