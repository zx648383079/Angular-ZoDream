import { Component, OnInit, inject } from '@angular/core';
import { IGameScene, GameRouterInjectorToken, IGameRouter } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-skill',
    templateUrl: './skill.component.html',
    styleUrls: ['./skill.component.scss']
})
export class SkillComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public tapBack() {
        this.router.navigateBack();
    }

}
