import { Component, inject, signal } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameFarmPlot, IGameRouter, IGameScene, InvestTabItems } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-game-ranch',
    templateUrl: './ranch.component.html',
    styleUrls: ['./ranch.component.scss']
})
export class RanchComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public readonly items = signal<IGameFarmPlot[]>([]);
    public tabItems = InvestTabItems;
    public tabIndex = 1;

    constructor() {
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
            this.items.set(res.data);
        });
    }
}
