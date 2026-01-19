import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-loading-ring',
    template: `
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>`,
    styleUrls: ['./loading-ring.component.scss'],
    host: {
        '[class]': 'ringName()'
    }
})
export class LoadingRingComponent {

    public readonly ringName = input('loading-ring1');

}
