import { Component, OnInit } from '@angular/core';
import { IGameScene } from '../../model';

@Component({
    selector: 'app-game-organize',
    templateUrl: './organize.component.html',
    styleUrls: ['./organize.component.scss']
})
export class OrganizeComponent implements IGameScene {

    public tabIndex = 0;
    public modalVisible = false;

    constructor() { }

        
    public tapBack() {

    }
}
