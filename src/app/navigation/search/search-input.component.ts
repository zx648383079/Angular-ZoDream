import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {

    @Input() public value = '';
    public suggestItems: string[] = [];
    public suggestIndex = -1;
    public histories: string[] = [];
    public openType = 0;

    @Output() public valueChange = new EventEmitter<string>();

    constructor(
        private service: NavigationService) {
    }

    public suggestKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.valueChange.emit(this.value);
            this.openType = 0;
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
        this.value = this.suggestItems[i];
    }

    public tapItem(value: string) {
        this.valueChange.emit(value);
        this.openType = 0;
    }

    public tapClear() {
        this.value = '';
        this.suggestItems = [];
        this.openType = 0;
    }

    public onSuggestChange() {
        if (this.suggestIndex >= 0) {
            return;
        }
        if (this.value.length < 1) {
            this.suggestItems = [];
            this.suggestIndex = -1;
            return;
        }
        this.service.searchSuggest(this.value).subscribe(res => {
            this.openType = 1;
            this.suggestItems = res.data;
            this.suggestIndex = -1;
        });
    }

    public tapHistory(v: string) {
        this.valueChange.emit(v);
        this.openType = 0;
    }

    public tapRemoveHistory(i: number, e: MouseEvent) {
        e.stopPropagation();
        this.histories.splice(i, 1);
    }

    public tapClearHistory() {
        this.histories = [];
    }

}
