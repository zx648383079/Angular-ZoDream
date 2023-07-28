import { Component, Inject, OnInit } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, GameScenePath, IGameRouter, IGameScene, IGmeRoute } from '../../model';

@Component({
    selector: 'app-game-organize',
    templateUrl: './organize.component.html',
    styleUrls: ['./organize.component.scss']
})
export class OrganizeComponent implements IGameScene, OnInit {

    public tabIndex = 0;
    public modalVisible = false;
    public bottomItems: IGmeRoute[] = [
        {name: '商店', path: GameScenePath.OrganizeStore},
        {name: '副本', path: GameScenePath.MapLevel},
        {name: '地图', path: GameScenePath.MapGlobe},
    ];

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    ngOnInit(): void {
        this.router.request(GameCommand.OrganizeOwn).subscribe(res => {

        });
    }

    public tapTab(i: number) {
        this.tabIndex = i;
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapRoute(item: IGmeRoute) {
        this.router.navigate(item.path);
    }

    public tapExit() {
        this.router.confirm('确定退出此帮派？').subscribe(() => {
            this.router.navigate(GameScenePath.Main);
        });
    }
}
