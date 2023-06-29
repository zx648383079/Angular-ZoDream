import { Component, OnInit } from '@angular/core';
import { IGameScene } from '../../model';

@Component({
    selector: 'app-game-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements IGameScene {

    constructor() { }
}
