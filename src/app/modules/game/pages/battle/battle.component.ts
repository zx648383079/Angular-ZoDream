import { Component } from '@angular/core';
import { IGameScene } from '../../model';

@Component({
    selector: 'app-game-battle',
    templateUrl: './battle.component.html',
    styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements IGameScene {

    constructor() { }


}
