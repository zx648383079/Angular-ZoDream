import { Component, OnInit } from '@angular/core';
import { IGameScene } from '../../model';

@Component({
    selector: 'app-game-entry',
    templateUrl: './entry.component.html',
    styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements IGameScene {

    
    public step = 0;
    constructor() { }

}
