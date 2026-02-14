import { Component, HostListener, effect, input, model, signal, untracked } from '@angular/core';
import { hasElementByClass } from '../../../theme/utils/doc';
import { FormValueControl } from '@angular/forms/signals';

const MailSuffixMap = [
    'qq.com',
    '163.com',
    '126.com',
    'live.com',
    'gmail.com',
    'sina.com',
    'hotmail.com',
];

@Component({
    standalone: false,
    selector: 'app-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements FormValueControl<string> {


    public readonly prefix = input('');
    public readonly suffix = input('@');
    public readonly suffixItems = model([...MailSuffixMap]);
    public readonly value = model('');
    
    public readonly panelVisible = signal(false);
    public readonly optionItems = signal<string[]>([]);
    public selectedIndex = -1;

    constructor() {
        effect(() => {
            if (this.suffix() === '@') {
                this.suffixItems.set([...MailSuffixMap]);
            }
        });
        let previousValue = '';
        effect(() => {
            const value = this.value();
            untracked(() => {
                if (this.realValue(value) !== this.realValue(previousValue)) {
                    this.selectedIndex = -1;
                    this.refreshOption();
                } else if (this.selectedIndex < 0) {
                    this.panelVisible.set(this.optionItems().indexOf(value) < 0);
                }
            })
            previousValue = value;
        });
    }

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.autocomplete') && !hasElementByClass(event.path, 'autocomplete')) {
            this.panelVisible.set(false);
        }
    }

    @HostListener('document:keydown', ['$event']) 
    public onKeyDown(event: KeyboardEvent) {
        if (this.optionItems.length < 1) {
            return;
        }
        if (event.key === 'ArrowDown') {
            this.output(this.selectedIndex >= this.optionItems.length - 1 ? 0 : (this.selectedIndex + 1));
        } else if (event.key === 'ArrowUp') {
            this.output(this.selectedIndex <= 0 ? this.optionItems.length - 1 : (this.selectedIndex - 1));
        } else if (event.key === 'Enter' || event.key === 'Tab') {
            this.panelVisible.set(false);
        } else {
            this.selectedIndex = -1;
        }
    }

    public tapInput() {
        this.panelVisible.set(true);
    }

    public isSelected(i: number) {
        return this.selectedIndex === i;
    }

    public tapSelected(i: number) {
        this.output(i);
        this.panelVisible.set(false);
    }

    private output(i: number) {
        this.selectedIndex = i;
        this.value.set(this.optionItems()[i]);
    }

    private realValue(value: string) {
        if (typeof value !== 'string') {
            return '';
        }
        const i = value.indexOf(this.suffix());
        return i > 0 ? value.substring(0, i) : value;
    }

    private refreshOption() {
        const value = this.realValue(this.value());
        if (value.length < 1) {
            this.optionItems.set([]);
            return;
        }
        const items = [];
        for (const item of this.suffixItems()) {
            items.push(this.prefix() + value + this.suffix() + item);
        }
        this.optionItems.set(items);
    }
}
