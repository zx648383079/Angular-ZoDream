import { Component, inject, signal } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, GameScenePath, IGameMapDungeon, IGameRouter, IGameScene } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-game-map-level',
    templateUrl: './map-level.component.html',
    styleUrls: ['./map-level.component.scss']
})
export class MapLevelComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public readonly items = signal<IGameMapDungeon[]>([]);

    constructor() {
        this.router.request(GameCommand.MapDungeonQuery).subscribe(res => {
            this.items.set(res.data);
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
