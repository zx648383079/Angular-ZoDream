import { Component, inject, signal } from '@angular/core';
import { IGameScene, InvestTabItems, GameRouterInjectorToken, IGameRouter, GameCommand } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-game-bank',
    templateUrl: './bank.component.html',
    styleUrls: ['./bank.component.scss']
})
export class BankComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public readonly items = signal<any[]>([]);
    public tabItems = InvestTabItems;
    public tabIndex = 3;

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
