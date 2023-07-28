import { Component, Inject, OnInit } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, GameScenePath, IGameMapDungeon, IGameRouter, IGameScene } from '../../../model';

@Component({
    selector: 'app-game-map-level',
    templateUrl: './map-level.component.html',
    styleUrls: ['./map-level.component.scss']
})
export class MapLevelComponent implements IGameScene, OnInit {

    public items: IGameMapDungeon[] = [];

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

    public tapEnter(item: IGameMapDungeon) {
        this.router.navigate(GameScenePath.Map);
    }

    public tapSweep(item: IGameMapDungeon) {
        this.router.confirm('确认继续扫荡？');
    }
}
