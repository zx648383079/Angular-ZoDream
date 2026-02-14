import { Component, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-profiler-game-list',
    templateUrl: './game-list.component.html',
    styleUrls: ['./game-list.component.scss']
})
export class GameListComponent {

    public readonly items = signal([
        {
            id: 1,
            logo: '',
            name: 'CS',
            description: ''
        }
    ]);

    constructor() {
    }

}
