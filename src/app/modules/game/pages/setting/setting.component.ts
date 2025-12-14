import { Component, inject } from '@angular/core';
import { GameRouterInjectorToken, IGameRouter, IGameScene } from '../../model';

@Component({
    standalone: false,
  selector: 'app-game-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public tapBack() {
        this.router.navigateBack();
    }

}
