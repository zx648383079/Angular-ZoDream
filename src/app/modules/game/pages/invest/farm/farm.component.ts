import { Component, Inject, OnInit } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameFarmPlot, IGameRouter, IGameScene, InvestTabItems } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-game-farm',
    templateUrl: './farm.component.html',
    styleUrls: ['./farm.component.scss']
})
export class FarmComponent implements IGameScene, OnInit {
    
    public items: IGameFarmPlot[] = [];
    public tabItems = InvestTabItems;
    public tabIndex = 0;

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
        this.router.request(GameCommand.FarmQuery).subscribe(res => {
            this.items = res.data;
        });
    }
}
