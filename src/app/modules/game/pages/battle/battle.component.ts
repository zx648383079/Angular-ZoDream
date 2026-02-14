import { Component, inject } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameRouter, IGameScene } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-battle',
    templateUrl: './battle.component.html',
    styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public tapBattle() {
        this.router.request(GameCommand.MapBattle, {}).subscribe(res => {

        });
    }

}
