import { Component, Inject, OnInit } from '@angular/core';
import { GameRouterInjectorToken, IGameRouter, IGameScene } from '../../model';

@Component({
    selector: 'app-game-ranch',
    templateUrl: './ranch.component.html',
    styleUrls: ['./ranch.component.scss']
})
export class RanchComponent implements IGameScene {

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    public tapBack() {
        this.router.navigateBack();
    }
}
