import { Component, Inject, OnInit } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameRouter, IGameScene } from '../../../model';

@Component({
    selector: 'app-game-map-level',
    templateUrl: './map-level.component.html',
    styleUrls: ['./map-level.component.scss']
})
export class MapLevelComponent implements IGameScene, OnInit {

    public items: any[] = [];

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    ngOnInit(): void {
        this.router.request(GameCommand.MapDungeonQuery).subscribe(res => {
            this.items = res.data;
        });
    }

    public tapBack() {
        this.router.navigateBack();
    }

}
