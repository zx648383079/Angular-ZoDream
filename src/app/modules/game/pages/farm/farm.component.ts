import { Component, Inject, OnInit } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, GameScenePath, IGameFarmPlot, IGameRouter, IGameScene } from '../../model';

@Component({
    selector: 'app-game-farm',
    templateUrl: './farm.component.html',
    styleUrls: ['./farm.component.scss']
})
export class FarmComponent implements IGameScene, OnInit {
    
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
        this.router.navigateReplace(GameScenePath.Ranch);
    }

    public tapRefresh() {
        this.router.request(GameCommand.FarmQuery).subscribe(res => {
            this.items = res.data;
        });
    }
}
