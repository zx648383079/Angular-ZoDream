import { Component, OnInit, inject, signal } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameFarmPlot, IGameRouter, IGameScene, InvestTabItems } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-game-farm',
    templateUrl: './farm.component.html',
    styleUrls: ['./farm.component.scss']
})
export class FarmComponent implements IGameScene, OnInit {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);

    
    public readonly items = signal<IGameFarmPlot[]>([]);
    public tabItems = InvestTabItems;
    public readonly tabIndex = signal(0);

    ngOnInit(): void {
        this.tapRefresh();
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapTab(i: number) {
        // this.tabIndex.set(i);
        this.router.navigateReplace(this.tabItems[i].value);
    }

    public tapRefresh() {
        this.router.request(GameCommand.FarmQuery).subscribe(res => {
            this.items.set(res.data);
        });
    }
}
