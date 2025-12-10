import { Component, effect, ElementRef, input, model, viewChild } from '@angular/core';
import { eachObject } from '../../../theme/utils';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-words-input',
    templateUrl: './words-input.component.html',
    styleUrls: ['./words-input.component.scss'],
})
export class WordsInputComponent implements FormValueControl<string[] | number | string> {

    private readonly inputBoxRef = viewChild<ElementRef<HTMLInputElement>>('inputBox');

    public readonly placeholder = input($localize `Please input...`);
    public readonly join = input(',');
    
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string[] | number | string>('');
    public selectedItems: string[] = [];
    public keywords = '';
    public isFocus = false;

    constructor() {
        effect(() => this.writeValue(this.value()));
    }

    private output() {
        const join = this.join();
        this.value.set(join ? this.selectedItems.join(join) : {...this.selectedItems});
    }

    public tapUnselect(v: string) {
        for (let i = this.selectedItems.length - 1; i >= 0; i--) {
            if (this.selectedItems[i] === v) {
                this.selectedItems.splice(i, 1);
            }
        }
        this.output();
    }

    public tapEdit(item: string) {
        this.keywords = item;
        for (let i = this.selectedItems.length - 1; i >= 0; i--) {
            if (this.selectedItems[i] == item) {
                this.selectedItems.splice(i, 1);
            }
        }
        this.inputBoxRef().nativeElement?.focus();
    }

    public onKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            this.onBlur();
        }
    }

    public onBlur() {
        this.isFocus = false;
        this.push(this.keywords);
        this.keywords = '';
        this.output();
    }

    public push(v: any) {
        if (v === null || v === undefined || v === '') {
            return;
        }
        if (typeof v !== 'string') {
            v = `${v}`;
        }
        v = v.trim();
        if (this.selectedItems.indexOf(v) >= 0) {
            return;
        }
        this.selectedItems.push(v);
    }

    private writeValue(obj: any): void {
        this.selectedItems = [];
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
