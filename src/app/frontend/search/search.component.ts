import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../theme/services';
import { SuggestChangeEvent } from '../../components/form';

@Component({
    standalone: false,
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    private readonly themeService = inject(ThemeService);


    public readonly panelVisible = signal(false);

    public tapConfirm(keywords: any) {
        this.themeService.suggestQuerySubmitted.next(keywords);
        this.close();
    }

    public onSuggestChange(e: SuggestChangeEvent) {
        this.themeService.suggestTextChanged.next(e);
    }

    public open() {
        this.panelVisible.set(true);
    }

    public close() {
        this.panelVisible.set(false);
    }
}
