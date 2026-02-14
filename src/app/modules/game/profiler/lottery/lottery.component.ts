import { Component, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-profiler-lottery',
    templateUrl: './lottery.component.html',
    styleUrls: ['./lottery.component.scss']
})
export class LotteryComponent {

    public readonly items = signal([
        1, 2, 4, 5
    ]);

    constructor() {
    }

}
