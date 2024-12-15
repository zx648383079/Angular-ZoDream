import { Component, Inject, OnInit } from '@angular/core';
import { IGameScene, GameRouterInjectorToken, IGameRouter } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-skill',
    templateUrl: './skill.component.html',
    styleUrls: ['./skill.component.scss']
})
export class SkillComponent implements IGameScene {

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    public tapBack() {
        this.router.navigateBack();
    }

}
