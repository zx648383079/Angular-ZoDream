import { Component, inject } from '@angular/core';
import { GameRouterInjectorToken, IGameRouter, GameScenePath, GameCommand, IGameTeam, IGamePeople } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss']
})
export class TeamComponent {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public data: IGameTeam;
    public userItems: IGamePeople[] = [];

    constructor() {
        this.router.request(GameCommand.TeamOwn).subscribe(res => {
            this.data = res.data;
            this.userItems = res.data.user_items;
        });
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapExit() {
        this.router.confirm('确定退出此队伍？').subscribe(() => {
            this.router.request(GameCommand.TeamDisbandOwn).subscribe(res => {
                this.router.navigate(GameScenePath.Main);
            });
        });
    }

    public tapExclude(item: any) {
        this.router.confirm('确定踢出此人？').subscribe(() => {
            this.router.request(GameCommand.TeamExcludeOwn, {user: item.id}).subscribe(res => {
                this.router.navigate(GameScenePath.Main);
            });
        });
    }


}
