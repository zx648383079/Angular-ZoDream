import { Component, OnInit } from '@angular/core';
import { IGameScene } from '../../model';

@Component({
    selector: 'app-game-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent implements IGameScene {

    constructor() { }

    public tapBack() {

    }
}
