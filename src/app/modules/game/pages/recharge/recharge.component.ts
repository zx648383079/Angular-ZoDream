import { Component, Inject } from '@angular/core';
import { GameRouterInjectorToken, IGameRouter, IGameScene } from '../../model';

@Component({
  selector: 'app-game-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss']
})
export class RechargeComponent implements IGameScene {

    public tabIndex = 0;
    public modalVisible = false;

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    public tapBack() {
        this.router.navigateBack();
    }
}
