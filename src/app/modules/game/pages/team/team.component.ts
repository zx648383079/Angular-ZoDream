import { Component, Inject, OnInit } from '@angular/core';
import { GameRouterInjectorToken, IGameRouter, GameScenePath, GameCommand } from '../../model';

@Component({
  selector: 'app-game-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    ngOnInit() {
        this.router.request(GameCommand.TeamOwn).subscribe(res => {

        });
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapExit() {
        this.router.confirm('确定退出此队伍？').subscribe(() => {
            this.router.navigate(GameScenePath.Main);
        });
    }



}
