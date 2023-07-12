import { Component, Inject, OnInit } from '@angular/core';
import { GameRouterInjectorToken, IGameRouter, IGameScene } from '../../model';

@Component({
    selector: 'app-game-battle',
    templateUrl: './battle.component.html',
    styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements IGameScene, OnInit {

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    ngOnInit(): void {
        
    }

}
