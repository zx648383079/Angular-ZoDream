import { Component, Inject, OnInit } from '@angular/core';
import { IGameScene, GameRouterInjectorToken, IGameRouter } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-game-map-globe',
    templateUrl: './map-globe.component.html',
    styleUrls: ['./map-globe.component.scss']
})
export class MapGlobeComponent implements IGameScene {

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    public tapBack() {
        this.router.navigateBack();
    }

}
