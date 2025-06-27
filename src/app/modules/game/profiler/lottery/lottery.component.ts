import { Component, OnInit } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-profiler-lottery',
    templateUrl: './lottery.component.html',
    styleUrls: ['./lottery.component.scss']
})
export class LotteryComponent implements OnInit {

    public items: any[] = [
        1, 2, 4, 5
    ]

    constructor() { }

    ngOnInit() {
    }

}
