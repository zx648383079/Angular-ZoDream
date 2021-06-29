import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '../../theme/services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

    public panelVisible = false;
    public suggestItems: any[] = [];
    public suggestText = '';
    public suggestIndex = -1;
    private asyncHandle = 0;

    constructor(
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.searchService.on('suggest', items => {
            this.suggestIndex = -1;
            this.suggestItems = items;
        });
    }

    ngOnDestroy() {
        this.searchService.offTrigger();
    }

    public formatTitle(item: any) {
        if (typeof item !== 'object') {
            return item;
        }
        return item.title || item.name;
    }

    public suggestKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.searchService.emit('confirm', this.suggestIndex >= 0 ? this.suggestItems[this.suggestIndex] : this.suggestText);
            this.close();
            return;
        }
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
            this.suggestIndex = -1;
            return;
        }
        if (this.suggestItems.length < 0) {
            return;
        }
        let i = this.suggestIndex;
        if (event.key === 'ArrowDown') {
            i = i < this.suggestItems.length - 1 ? i + 1 : 0;
        } else if (event.key === 'ArrowUp') {
            i = (i < 1 ? this.suggestItems.length: i) - 1;
        }
        this.suggestIndex = i;
        this.suggestText = this.formatTitle(this.suggestItems[this.suggestIndex]);
    }

    public onSuggestChange() {
        if (this.suggestIndex >= 0) {
            return;
        }
        this.asyncSuggest();
    }

    public tapItem(item: any) {
        this.searchService.emit('confirm', item);
        this.close();
    }

    public tapClear() {
        this.suggestText = '';
        this.suggestItems = [];
    }

    public open() {
        this.panelVisible = true;
    }

    public close() {
        this.panelVisible = false;
    }

    private asyncSuggest() {
        if (this.asyncHandle) {
            clearTimeout(this.asyncHandle);
        }
        this.suggestIndex = -1;
        this.asyncHandle = window.setTimeout(() => {
            this.asyncHandle = 0;
            this.suggestIndex = -1;
            if (this.suggestText.length < 1) {
                this.suggestItems = [];
                return;
            }
            this.searchService.emit('change', this.suggestText);
        }, 300);
    }
}
