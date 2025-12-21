import { Component, inject } from '@angular/core';
import { GameRouterInjectorToken, IGameRouter, IGameScene } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-recharge',
    templateUrl: './recharge.component.html',
    styleUrls: ['./recharge.component.scss']
})
export class RechargeComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public tabIndex = 0;
    public modalVisible = false;

    public tapBack() {
        this.router.navigateBack();
    }
}
