import { Component, effect, HostListener, inject, input, model, output, signal } from '@angular/core';
import { SuggestChangeEvent, SuggestEvent } from '../../../components/form';
import { ISearchBar, ISearchEngine, SearchEngineItems } from './engine';
import { HttpClient } from '@angular/common/http';
import { parseNumber } from '../../../theme/utils';
import { hasElementByClass } from '../../../theme/utils/doc';

@Component({
    standalone: false,
    selector: 'app-navigation-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements SuggestEvent, ISearchBar {
    private readonly http = inject(HttpClient);


    public readonly value = model('');
    public readonly placeholder = input($localize `Please enter a keyword, press Enter to search`);
    public readonly suggestable = model(true);
    public readonly historyKey = input('');
    private eniginKey = 'sd';
    public readonly suggestItems = signal<any[]>([]);
    public readonly dropIndex = signal(-1);
    public readonly histories = signal<string[]>([]);
    public readonly openType = signal(0);
    public readonly currentEngine = signal<ISearchEngine>(null);
    public engineItems: ISearchEngine[] = [
        {
            name: $localize `Default`,
            icon: 'icon-globe',
            url: ''
        },
        ...SearchEngineItems
    ];

    public readonly textChange = output<SuggestChangeEvent>();
    public readonly confirm = output<any>();

    constructor() {
        const index = parseNumber(window.localStorage.getItem(this.eniginKey)) || 0;
        this.currentEngine.set(this.engineItems[index]);
        effect(() => {
            this.historyKey();
            this.loadHistory();
        });
    }

    @HostListener('document:click', ['$event']) 
    hideSearchBar(event: any) {
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
        this.openType.set(this.histories().length > 0 ? 2 : 0);
    }

    public toggleEngine() {
        this.openType.set(this.openType() == 3 ? 0 : 3);
    }

    public onBlur() {
        // if (this.openType == 2) {
        //     this.openType = 0;
        // }
    }

    public tapEngine(i: number) {
        window.localStorage.setItem(this.eniginKey, i.toString());
        this.currentEngine.set(this.engineItems[i]);
        this.openType.set(0);
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
        this.gotoSearch(value);
        this.openType.set(0);
    }

    public tapConfirm(e: SubmitEvent) {
        e.preventDefault();
        let text = this.openType() === 1 && this.dropIndex() >= 0 ? this.suggestItems()[this.dropIndex()] : this.value();
        this.gotoSearch(text);
        this.openType.set(0);
        this.addHistory(text);
    }

    private gotoSearch(keywords: any) {
        if (!keywords || !this.currentEngine().url) {
            this.confirm.emit(keywords);
            return;
        }
        const url = this.currentEngine().url.replace('{word}', encodeURIComponent(this.formatTitle(keywords).trim()));
        window.open(url, '_blank');
    }

    public tapClear() {
        this.value.set('');
        this.suggestItems.set([]);
        this.openType.set(0);
    }

    public onSuggestChange(e: Event) {
        this.value.set((e.target as HTMLInputElement).value);
        if (!this.suggestable() || this.dropIndex() >= 0) {
            return;
        }
        if (this.value().length < 1) {
            this.suggestItems.set([]);
            this.dropIndex.set(-1);
            return;
        }
        if (!this.currentEngine().suggest) {
            this.textChange.emit({
                text: this.value(),
                suggest: this.suggest.bind(this)
            });
            return;
        }
        const suggest = this.currentEngine().suggest;
        const keywords = encodeURIComponent(this.value());
        if (typeof suggest == 'string') {
            this.jsonp(suggest + keywords, res => {
                if (!res || !res.data || res.data.length < 1) {
                    this.suggest([]);
                    return;
                }
                this.suggest(res.data as string[] || []);
            });
            return;
        }
        suggest.call(this, keywords, res => {
            if (!res || res.length < 1) {
                this.suggest([]);
                return;
            }
            this.suggest(res as string[] || []);
        });
    }

    public tapHistory(v: string) {
        this.value.set(v);
        this.openType.set(0);
        this.gotoSearch(v);
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

    public jsonp(url: string, cb: Function, cbName: string = 'cb') {
        this.http.jsonp(url, cbName).subscribe({
            next: res => {
                cb(res);
            },
            error: err => {
                console.log(err);
                cb();
            }
        });
    }

}
