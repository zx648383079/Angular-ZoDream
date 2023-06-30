import { Component, Inject, OnInit } from '@angular/core';
import { GameRouterInjectorToken, GameScenePath, IGameRouter, IGameScene } from '../../model';

@Component({
    selector: 'app-game-organize',
    templateUrl: './organize.component.html',
    styleUrls: ['./organize.component.scss']
})
export class OrganizeComponent implements IGameScene {

    public tabIndex = 0;
    public modalVisible = false;

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapExit() {
        this.router.confirm('确定退出此帮派？').subscribe(() => {
            this.router.navigate(GameScenePath.Main);
        });
    }
}
