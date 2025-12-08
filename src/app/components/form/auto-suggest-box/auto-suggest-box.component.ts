import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SuggestChangeEvent } from '../event';
import { hasElementByClass } from '../../../theme/utils/doc';

@Component({
    standalone: false,
    selector: 'app-auto-suggest-box',
    templateUrl: './auto-suggest-box.component.html',
    styleUrls: ['./auto-suggest-box.component.scss']
})
export class AutoSuggestBoxComponent implements OnChanges, SuggestChangeEvent {

    @Input() public text = '';
    @Input() public placeholder = $localize `Please enter a keyword, press Enter to search`;
    @Input() public historyKey = '';
    public suggestItems: any[] = [];
    public dropIndex = -1;
    public histories: string[] = [];
    public openType = 0;

    @Output() public textChange = new EventEmitter<SuggestChangeEvent>();
    @Output() public confirm = new EventEmitter<any>();

    constructor() {}

    @HostListener('document:click', ['$event']) 
    public hideSearchBar(event: any) {
        if (!event.target.closest('.search-box') && !hasElementByClass(event.path, 'search-box')) {
            this.openType = 0;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.historyKey) {
            this.loadHistory();
        }
    }

    public formatTitle(item: any) {
        if (typeof item !== 'object') {
            return item;
        }
        return item.title || item.name;
    }

    public onFocus() {
        if (this.text.length > 0) {
            return;
        }
        this.openType = this.histories.length > 0 ? 2 : 0;
    }

    public onBlur() {
        // if (this.openType == 2) {
        //     this.openType = 0;
        // }
    }

    public suggest(items: any[]) {
        this.suggestItems = items;
        this.dropIndex = -1;
        this.openType = items.length > 0 ? 1 : 0; 
    }

    public suggestKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            // this.tapConfirm();
            return;
        }
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
            this.dropIndex = -1;
            return;
        }
        if (this.openType === 1) {
            this.moveDrop(this.suggestItems, event.key === 'ArrowUp');
        } else if (this.openType === 2) {
            this.moveDrop(this.histories, event.key === 'ArrowUp');
        }
    }

    private moveDrop(items: any[], up = true) {
        if (items.length < 0) {
            return;
        }
        let i = this.dropIndex;
        if (up) {
            i = (i < 1 ? items.length: i) - 1;
        } else {
            i = i < items.length - 1 ? i + 1 : 0;
        }
        this.dropIndex = i;
        this.text = this.formatTitle(items[i]);
    }

    public tapItem(value: any) {
        this.text = this.formatTitle(value);
        this.dropIndex = this.suggestItems.indexOf(value);
        this.confirm.emit(value);
        this.openType = 0;
    }

    public tapConfirm() {
        let text = this.openType === 1 && this.dropIndex >= 0 ? this.suggestItems[this.dropIndex] : this.text;
        this.confirm.emit(text);
        this.openType = 0;
        this.addHistory(text);
    }

    public tapClear() {
        this.text = '';
        this.suggestItems = [];
        this.openType = 0;
    }

    public onSuggestChange() {
        if (this.dropIndex >= 0) {
            return;
        }
        if (this.text.length < 1) {
            this.suggestItems = [];
            this.dropIndex = -1;
            return;
        }
        this.textChange.emit({
            text: this.text,
            suggest: this.suggest.bind(this)
        });
    }

    public tapHistory(v: string) {
        this.confirm.emit(v);
        this.text = v;
        this.openType = 0;
    }

    public tapRemoveHistory(i: number, e: MouseEvent) {
        e.stopPropagation();
        this.histories.splice(i, 1);
        this.saveHistory();
        if (this.histories.length < 1) {
            this.openType = 0;
        }
    }

    public tapClearHistory() {
        this.histories = [];
        this.saveHistory();
        this.openType = 0;
    }

    private addHistory(item: string) {
        item = item.trim();
        if (item.length < 1 || this.histories.indexOf(item) >= 0) {
            return;
        }
        this.histories.push(item);
        if (this.histories.length > 8) {
            this.histories.splice(8);
        }
        this.saveHistory();
    }

    private saveHistory() {
        if (!this.historyKey) {
            return;
        }
        if (this.histories.length === 0) {
            window.localStorage.removeItem(this.historyKey);
            return;
        }
        window.localStorage.setItem(this.historyKey, JSON.stringify(this.histories));
    }

    private loadHistory() {
        if (!this.historyKey) {
            return;
        }
        const text = window.localStorage.getItem(this.historyKey);
        if (!text) {
            return;
        }
        this.histories = JSON.parse(text) || [];
    }

}
