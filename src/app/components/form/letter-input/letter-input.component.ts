import { Component, computed, effect, input, model, signal, untracked } from '@angular/core';
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
    public readonly isEnabled = signal(false);


    public readonly letterCount = computed(() => {
        const items = this.items();
        for (let i = 0; i < items.length; i++) {
            if (items[i] === '') {
                return i;
            }
        }
        return items.length;
    });

    constructor() {
        effect(() => {
            const length = this.length();
            untracked(() => {
                this.items.set(Array.from({length}, _ => ''))
            });
        });
        effect(() => this.refresh(this.value()));
    }

    public onValueChanged(value: string) {
        this.refresh(value);
        if (value.length === this.length()) 
        {
            this.value.set(value);
        }
    }

    public onFocus() {
        this.isEnabled.set(true);
    }

    public onBlur() {
        this.isEnabled.set(false);
    }

    private refresh(value: string) {
        this.items.update(v => {
            return v.map((_, i) => i >= value.length ? '' : value.charAt(i));
        });
    }
}
