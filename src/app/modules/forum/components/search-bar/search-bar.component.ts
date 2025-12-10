import { Component, input, output } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

    public readonly keywords = input('');
    public readonly type = input(0);
    public readonly confirm = output<any>();

    public typeItems = [
        $localize `All`,
        $localize `Current`,
        $localize `Users`,
    ];

    constructor() { }

    public tapSearch() {
        this.confirm.emit({type: this.type(), keywords: this.keywords()});
    }
}
