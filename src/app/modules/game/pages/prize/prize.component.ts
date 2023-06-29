import { Component, OnInit } from '@angular/core';
import { IGameScene } from '../../model';

@Component({
    selector: 'app-game-prize',
    templateUrl: './prize.component.html',
    styleUrls: ['./prize.component.scss']
})
export class PrizeComponent implements IGameScene {

    public modalVisible = false;

    constructor() { }

    ngOnInit() {
    }

    public tapBack() {

    }
}
