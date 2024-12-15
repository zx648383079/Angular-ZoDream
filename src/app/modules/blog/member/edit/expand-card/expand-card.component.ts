import { Component, HostBinding, Input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-expand-card',
    templateUrl: './expand-card.component.html',
    styleUrls: ['./expand-card.component.scss'],
    host: {
        class: 'expand-card',
    }
})
export class ExpandCardComponent {

    @HostBinding('class.open')
    @Input() public toggle = false;
    @Input() public header = 'Header';

    constructor() { }

}
