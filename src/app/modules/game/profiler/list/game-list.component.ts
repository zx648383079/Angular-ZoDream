import { Component, OnInit } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-profiler-game-list',
    templateUrl: './game-list.component.html',
    styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

    public items: any[] = [
        {
            id: 1,
            name: 'CS'
        }
    ];

    constructor() { }

    ngOnInit() {
    }

}
