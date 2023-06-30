import { Component, Inject } from '@angular/core';
import { GameRouterInjectorToken, GameScenePath, IGameRouter, IGameScene, IGmeRoute } from '../../model';

@Component({
    selector: 'app-game-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements IGameScene {

    public bottomItems: IGmeRoute[] = [
        {name: '背包', path: GameScenePath.Bag},
        {name: '技能', path: GameScenePath.Skill},
        {name: '地图', path: GameScenePath.MapGlobe},
    ];

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapMonster() {
        this.router.navigate(GameScenePath.Battle);
    }

    public tapItem() {
        this.router.toast('获取 水晶 x 1');
    }

    public tapNpc() {

    }

    public tapMap() {

    }

    public tapRoute(item: IGmeRoute) {
        this.router.navigate(item.path);
    }


}
