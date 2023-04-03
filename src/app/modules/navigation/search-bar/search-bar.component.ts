import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SuggestChangeEvent, SuggestEvent } from '../../../components/form';
import { ISearchBar, ISearchEngine, SearchEngineItems } from './engine';
import { HttpClient } from '@angular/common/http';
import { hasElementByClass, parseNumber } from '../../../theme/utils';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnChanges, SuggestEvent, ISearchBar {

    @Input() public text = '';
    @Input() public placeholder = $localize `Please enter a keyword, press Enter to search`;
    @Input() public suggestable = true;
    @Input() private historyKey = '';
    private eniginKey = 'sd';
    public suggestItems: any[] = [];
    public dropIndex = -1;
    public histories: string[] = [];
    public openType = 0;
    public currentEngine: ISearchEngine;
    public engineItems: ISearchEngine[] = [
        {
            name: $localize `Default`,
            icon: 'icon-globe',
            url: ''
        },
        ...SearchEngineItems
    ];

    @Output() public textChange = new EventEmitter<SuggestChangeEvent>();
    @Output() public confirm = new EventEmitter<any>();

    constructor(
        private http: HttpClient
    ) {
        const index = parseNumber(window.localStorage.getItem(this.eniginKey)) || 0;
        this.currentEngine = this.engineItems[index];
    }

    @HostListener('document:click', ['$event']) 
    hideSearchBar(event: any) {
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

    public toggleEngine() {
        this.openType = this.openType == 3 ? 0 : 3;
    }

    public onBlur() {
        // if (this.openType == 2) {
        //     this.openType = 0;
        // }
    }

    public tapEngine(i: number) {
        window.localStorage.setItem(this.eniginKey, i.toString());
        this.currentEngine = this.engineItems[i];
        this.openType = 0;
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
        this.gotoSearch(value);
        this.openType = 0;
    }

    public tapConfirm() {
        let text = this.openType === 1 && this.dropIndex >= 0 ? this.suggestItems[this.dropIndex] : this.text;
        this.gotoSearch(text);
        this.openType = 0;
        this.addHistory(text);
    }

    private gotoSearch(keywords: any) {
        if (!keywords || !this.currentEngine.url) {
            this.confirm.emit(keywords);
            return;
        }
        const url = this.currentEngine.url.replace('{word}', encodeURIComponent(this.formatTitle(keywords).trim()));
        window.open(url, '_blank');
    }

    public tapClear() {
        this.text = '';
        this.suggestItems = [];
        this.openType = 0;
    }

    public onSuggestChange() {
        if (!this.suggestable || this.dropIndex >= 0) {
            return;
        }
        if (this.text.length < 1) {
            this.suggestItems = [];
            this.dropIndex = -1;
            return;
        }
        if (!this.currentEngine.suggest) {
            this.textChange.emit({
                text: this.text,
                suggest: this.suggest.bind(this)
            });
            return;
        }
        const suggest = this.currentEngine.suggest;
        const keywords = encodeURIComponent(this.text);
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
        this.text = v;
        this.openType = 0;
        this.gotoSearch(v);
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
