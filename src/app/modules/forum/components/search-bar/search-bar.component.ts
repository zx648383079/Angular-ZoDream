import { Component, model, output } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

    public readonly value = model('');
    public readonly type = model(0);
    public readonly confirm = output<any>();

    public typeItems = [
        $localize `All`,
        $localize `Current`,
        $localize `Users`,
    ];

    public tapSearch() {
        this.confirm.emit({type: this.type(), keywords: this.value()});
    }
}
