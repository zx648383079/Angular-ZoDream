import { Component, effect, input, model, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-letter-input',
    templateUrl: './letter-input.component.html',
    styleUrls: ['./letter-input.component.scss'],
})
export class LetterInputComponent implements FormValueControl<string> {

    public readonly length = input(4);
    public readonly items = signal<string[]>(['', '', '', '']);
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    public isEnabled = false;

    constructor() {
        effect(() => this.items.set(Array.from({length: this.length()}, _ => '')));
        effect(() => this.refresh(this.value()));
    }

    public onValueChanged(value: string) {
        this.refresh(value);
        if (value.length == this.length()) 
        {
            this.value.set(value);
        }
    }

    public onFocus() {
        this.isEnabled = true;
    }

    public onBlur() {
        this.isEnabled = false;
    }

    private refresh(value: string) {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i] = i >= value.length ? '' : value.charAt(i);
        }
    }
}
