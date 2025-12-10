import { Component, input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-loading-ring',
    templateUrl: './loading-ring.component.html',
    styleUrls: ['./loading-ring.component.scss']
})
export class LoadingRingComponent {

    public readonly ringName = input('loading-ring1');

    constructor() { }

}
