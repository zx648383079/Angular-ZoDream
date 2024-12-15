import { Component, Inject, OnInit } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, GameScenePath, IGameFarmPlot, IGameRouter, IGameScene, InvestTabItems } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-game-ranch',
    templateUrl: './ranch.component.html',
    styleUrls: ['./ranch.component.scss']
})
export class RanchComponent implements IGameScene, OnInit {

    public items: IGameFarmPlot[] = [];
    public tabItems = InvestTabItems;
    public tabIndex = 1;

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    ngOnInit(): void {
        this.tapRefresh();
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapTab(i: number) {
        // this.tabIndex = i;
        this.router.navigateReplace(this.tabItems[i].value);
    }

    public tapRefresh() {
        this.router.request(GameCommand.RanchQuery).subscribe(res => {
            this.items = res.data;
        });
    }
}
