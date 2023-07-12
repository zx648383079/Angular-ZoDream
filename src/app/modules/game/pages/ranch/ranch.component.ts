import { Component, Inject, OnInit } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, GameScenePath, IGameFarmPlot, IGameRouter, IGameScene } from '../../model';

@Component({
    selector: 'app-game-ranch',
    templateUrl: './ranch.component.html',
    styleUrls: ['./ranch.component.scss']
})
export class RanchComponent implements IGameScene, OnInit {

    public items: IGameFarmPlot[] = [];

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    ngOnInit(): void {
        this.tapRefresh();
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapTab() {
        this.router.navigateReplace(GameScenePath.Farm);
    }

    public tapRefresh() {
        this.router.request(GameCommand.RanchQuery).subscribe(res => {
            this.items = res.data;
        });
    }
}
