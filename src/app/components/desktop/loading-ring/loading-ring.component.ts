import { Component, HostBinding, input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-loading-ring',
    template: `
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>`,
    styleUrls: ['./loading-ring.component.scss'],
})
export class LoadingRingComponent {

    @HostBinding('class')
    public readonly ringName = input('loading-ring1');

}
