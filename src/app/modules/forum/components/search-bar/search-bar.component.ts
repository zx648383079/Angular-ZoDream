import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

    @Input() public keywords = '';
    @Input() public type = 0;
    @Output() public confirm = new EventEmitter<any>();

    public typeItems = [
        $localize `All`,
        $localize `Current`,
        $localize `Users`,
    ];

    constructor() { }

    public tapSearch() {
        this.confirm.emit({type: this.type, keywords: this.keywords});
    }
}
