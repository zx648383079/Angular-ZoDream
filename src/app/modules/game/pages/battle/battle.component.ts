import { Component, OnInit, inject } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameRouter, IGameScene } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-battle',
    templateUrl: './battle.component.html',
    styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements IGameScene, OnInit {
    private router = inject<IGameRouter>(GameRouterInjectorToken);


    ngOnInit(): void {
        
    }

    public tapBattle() {
        this.router.request(GameCommand.MapBattle, {}).subscribe(res => {

        });
    }

}
