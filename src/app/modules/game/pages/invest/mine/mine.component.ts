import { Component, OnInit, inject } from '@angular/core';
import { IGameScene, InvestTabItems, GameRouterInjectorToken, IGameRouter, GameCommand } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-game-mine',
    templateUrl: './mine.component.html',
    styleUrls: ['./mine.component.scss']
})
export class MineComponent implements IGameScene, OnInit {
    private router = inject<IGameRouter>(GameRouterInjectorToken);


    public items: any[] = [];
    public tabItems = InvestTabItems;
    public tabIndex = 2;

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
