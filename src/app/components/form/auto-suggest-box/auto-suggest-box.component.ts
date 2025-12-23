import { Component, HostListener, effect, input, model, output, signal } from '@angular/core';
import { SuggestChangeEvent } from '../event';
import { hasElementByClass } from '../../../theme/utils/doc';

@Component({
    standalone: false,
    selector: 'app-auto-suggest-box',
    templateUrl: './auto-suggest-box.component.html',
    styleUrls: ['./auto-suggest-box.component.scss']
})
export class AutoSuggestBoxComponent implements SuggestChangeEvent {

    public readonly value = model('');
    public readonly placeholder = input($localize `Please enter a keyword, press Enter to search`);
    public readonly historyKey = input('');
    public readonly suggestItems = signal<any[]>([]);
    public readonly dropIndex = signal(-1);
    public readonly histories = signal<string[]>([]);
    public readonly openType = signal(0);

    public readonly textChange = output<SuggestChangeEvent>();
    public readonly confirm = output<any>();

    public get text() {
        return this.value();
    }

    constructor() {
        effect(() => {
            this.historyKey();
            this.loadHistory();
        });
    }

    @HostListener('document:click', ['$event']) 
    public hideSearchBar(event: any) {
        if (!event.target.closest('.search-box') && !hasElementByClass(event.path, 'search-box')) {
            this.openType.set(0);
        }
    }

    public formatTitle(item: any) {
        if (typeof item !== 'object') {
            return item;
        }
        return item.title || item.name;
    }

    public onFocus() {
        if (this.value().length > 0) {
            return;
        }
        this.openType.set(this.histories.length > 0 ? 2 : 0);
    }

    public onBlur() {
        // if (this.openType == 2) {
        //     this.openType = 0;
        // }
    }

    public suggest(items: any[]) {
        this.suggestItems.set(items);
        this.dropIndex.set(-1);
        this.openType.set(items.length > 0 ? 1 : 0); 
    }

    public suggestKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            // this.tapConfirm();
            return;
        }
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
            this.dropIndex.set(-1);
            return;
        }
        if (this.openType() === 1) {
            this.moveDrop(this.suggestItems(), event.key === 'ArrowUp');
        } else if (this.openType() === 2) {
            this.moveDrop(this.histories(), event.key === 'ArrowUp');
        }
    }

    private moveDrop(items: any[], up = true) {
        if (items.length < 0) {
            return;
        }
        let i = this.dropIndex();
        if (up) {
            i = (i < 1 ? items.length: i) - 1;
        } else {
            i = i < items.length - 1 ? i + 1 : 0;
        }
        this.dropIndex.set(i);
        this.value.set(this.formatTitle(items[i]));
    }

    public tapItem(value: any) {
        this.value.set(this.formatTitle(value));
        this.dropIndex.set(this.suggestItems().indexOf(value));
        this.confirm.emit(value);
        this.openType.set(0);
    }

    public tapConfirm(e: SubmitEvent) {
        e.preventDefault();
        let text = this.openType() === 1 && this.dropIndex() >= 0 ? this.suggestItems()[this.dropIndex()] : this.value();
        this.confirm.emit(text);
        this.openType.set(0);
        this.addHistory(text);
    }

    public tapClear() {
        this.value.set('');
        this.suggestItems.set([]);
        this.openType.set(0);
    }

    public onSuggestChange(val: string) {
        this.value.set(val);
        if (this.dropIndex() >= 0) {
            return;
        }
        if (this.value().length < 1) {
            this.suggestItems.set([]);
            this.dropIndex.set(-1);
            return;
        }
        this.textChange.emit({
            text: this.value(),
            suggest: this.suggest.bind(this)
        });
    }

    public tapHistory(v: string) {
        this.confirm.emit(v);
        this.value.set(v);
        this.openType.set(0);
    }

    public tapRemoveHistory(i: number, e: MouseEvent) {
        e.stopPropagation();
        this.histories.update(v => {
            v.splice(i, 1);
            return v;
        });
        this.saveHistory();
        if (this.histories().length < 1) {
            this.openType.set(0);
        }
    }

    public tapClearHistory() {
        this.histories.set([]);
        this.saveHistory();
        this.openType.set(0);
    }

    private addHistory(item: string) {
        item = item.trim();
        if (item.length < 1 || this.histories().indexOf(item) >= 0) {
            return;
        }
        this.histories.update(v => {
            v.push(item);
            if (v.length > 8) {
                v.splice(8);
            }
            return v;
        });
        this.saveHistory();
    }

    private saveHistory() {
        const historyKey = this.historyKey();
        if (!historyKey) {
            return;
        }
        if (this.histories().length === 0) {
            window.localStorage.removeItem(historyKey);
            return;
        }
        window.localStorage.setItem(historyKey, JSON.stringify(this.histories()));
    }

    private loadHistory() {
        const historyKey = this.historyKey();
        if (!historyKey) {
            return;
        }
        const text = window.localStorage.getItem(historyKey);
        if (!text) {
            return;
        }
        this.histories.set(JSON.parse(text) || []);
    }

}
