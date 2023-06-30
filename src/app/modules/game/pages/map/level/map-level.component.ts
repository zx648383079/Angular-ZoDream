import { Component, Inject, OnInit } from '@angular/core';
import { GameRouterInjectorToken, IGameRouter, IGameScene } from '../../../model';

@Component({
    selector: 'app-game-map-level',
    templateUrl: './map-level.component.html',
    styleUrls: ['./map-level.component.scss']
})
export class MapLevelComponent implements IGameScene {

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    public tapBack() {
        this.router.navigateBack();
    }

}
