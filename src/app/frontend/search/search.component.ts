import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SearchEvents } from '../../theme/models/event';
import { SearchService } from '../../theme/services';
import { SuggestChangeEvent } from '../../components/form';
import { AutoSuggestBoxComponent } from '../../components/form/auto-suggest-box/auto-suggest-box.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

    @ViewChild(AutoSuggestBoxComponent)
    private searchBar: AutoSuggestBoxComponent;
    public panelVisible = false;

    constructor(
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.searchService.on(SearchEvents.SUGGEST, items => {
            this.searchBar.suggest(items);
        });
    }

    ngOnDestroy() {
        this.searchService.offTrigger();
    }

    public tapConfirm(keywords: any) {
        this.searchService.emit(SearchEvents.CONFIRM, keywords);
        this.close();
    }

    public onSuggestChange(e: SuggestChangeEvent) {
        this.searchService.emit(SearchEvents.CHANGE, e.text);
    }

    public open() {
        this.panelVisible = true;
    }

    public close() {
        this.panelVisible = false;
    }
}
