import { Component, OnInit } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-profiler-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

    public items: any[] = [
        {
            name: 'test'
        },
        {
            name: 'test2'
        },
        {
            name: 'test5'
        }
    ];
    public itemMode = true;

    constructor() { }

    ngOnInit() {
    }

}
