import { Component } from '@angular/core';
import { ThemeService } from '../../theme/services';
import { SuggestChangeEvent } from '../../components/form';

@Component({
    standalone: false,
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {

    public panelVisible = false;

    constructor(
        private themeService: ThemeService,
    ) { }

    public tapConfirm(keywords: any) {
        this.themeService.suggestQuerySubmitted.next(keywords);
        this.close();
    }

    public onSuggestChange(e: SuggestChangeEvent) {
        this.themeService.suggestTextChanged.next(e);
    }

    public open() {
        this.panelVisible = true;
    }

    public close() {
        this.panelVisible = false;
    }
}
