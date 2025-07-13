import { Component, Input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-loading-ring',
    templateUrl: './loading-ring.component.html',
    styleUrls: ['./loading-ring.component.scss']
})
export class LoadingRingComponent {

    @Input() public ringName = 'loading-ring1';

    constructor() { }

}
