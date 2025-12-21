import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../../theme/services';
import { SuggestChangeEvent } from '../../../components/form';

@Component({
    standalone: false,
    selector: 'app-catering-search-input',
    templateUrl: './search-input.component.html',
    styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements SuggestChangeEvent {
    private readonly themeService = inject(ThemeService);


    public readonly panelVisible = signal(false);
    public suggestItems: any[] = [];
    public suggestText = '';
    public suggestIndex = -1;
    private asyncHandle = 0;

    public get text() {
        return this.suggestText;
    }

    public suggest(items: any[]): void {
        this.suggestIndex = -1;
        this.suggestItems = items;
    }

    public formatTitle(item: any) {
        if (typeof item !== 'object') {
            return item;
        }
        return item.title || item.name;
    }

    public suggestKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.themeService.suggestQuerySubmitted.next(this.suggestIndex >= 0 ? this.suggestItems[this.suggestIndex] : this.suggestText);
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
        this.themeService.suggestQuerySubmitted.next(item);
        this.close();
    }

    public tapClear() {
        this.suggestText = '';
        this.suggestItems = [];
    }

    public open() {
        this.panelVisible.set(true);
    }

    public close() {
        this.panelVisible.set(false);
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
            this.themeService.suggestTextChanged.next(this);
        }, 300);
    }

}
