import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { hasElementByClass } from '../../../theme/utils/doc';

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
export class AutocompleteComponent implements OnChanges, OnInit {

    @Input() public prefix = '';
    @Input() public suffix = '@';
    @Input() public suffixItems = [...MailSuffixMap];
    @Input() public value = '';
    @Output() public valueChange = new EventEmitter<string>();
    
    public panelVisible = false;
    public optionItems = [];
    public selectedIndex = -1;

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.autocomplete') && !hasElementByClass(event.path, 'autocomplete')) {
            this.panelVisible = false;
        }
    }

    constructor(
        private renderer: Renderer2
    ) { }

    ngOnInit() {
        this.renderer.listen(document, 'keydown', (event: KeyboardEvent) => {
            if (this.optionItems.length < 1) {
                return;
            }
            if (event.key === 'ArrowDown') {
                this.output(this.selectedIndex >= this.optionItems.length - 1 ? 0 : (this.selectedIndex + 1));
            } else if (event.key === 'ArrowUp') {
                this.output(this.selectedIndex <= 0 ? this.optionItems.length - 1 : (this.selectedIndex - 1));
            } else if (event.key === 'Enter' || event.key === 'Tab') {
                this.panelVisible = false;
            } else {
                this.selectedIndex = -1;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.suffix) {
            if (changes.suffix.currentValue === '@') {
                this.suffixItems = [...MailSuffixMap];
            }
        }
        if (changes.value) {
            if (this.realValue(changes.value.currentValue) !== this.realValue(changes.value.previousValue)) {
                this.selectedIndex = -1;
                this.refreshOption();
            } else if (this.selectedIndex < 0) {
                this.panelVisible = this.optionItems.indexOf(this.value) < 0;
            }
        }
    }

    public tapInput() {
        this.panelVisible = true;
    }

    public isSelected(i: number) {
        return this.selectedIndex === i;
    }

    public tapSelected(i: number) {
        this.output(i);
        this.panelVisible = false;
    }

    private output(i: number) {
        this.selectedIndex = i;
        this.valueChange.emit(this.value = this.optionItems[i]);
    }

    private realValue(value: string) {
        if (typeof value !== 'string') {
            return '';
        }
        const i = value.indexOf(this.suffix);
        return i > 0 ? value.substring(0, i) : value;
    }

    private refreshOption() {
        const value = this.realValue(this.value);
        if (value.length < 1) {
            this.optionItems = [];
            return;
        }
        const items = [];
        for (const item of this.suffixItems) {
            items.push(this.prefix + value + this.suffix + item);
        }
        this.optionItems = items;
    }
}
