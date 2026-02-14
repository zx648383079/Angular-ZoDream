import { Component, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-profiler-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent {

    public readonly items = signal<any[]>([
        {
            name: 'test'
        },
        {
            name: 'test2'
        },
        {
            name: 'test5'
        }
    ]);
    public itemMode = true;

    constructor() {
    }

}
