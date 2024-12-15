import { Component, Inject, OnInit } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, GameScenePath, IGameRouter, IGameScene, IGmeRoute } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements IGameScene, OnInit {

    public bottomItems: IGmeRoute[] = [
        {name: '主页', path: GameScenePath.Main},
        {name: '背包', path: GameScenePath.Bag},
        {name: '技能', path: GameScenePath.Skill},
        {name: '地图', path: GameScenePath.MapGlobe},
    ];

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    public ngOnInit(): void {
        this.router.request(GameCommand.MapMove).subscribe(res => {

        });
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapMonster() {
        this.router.navigate(GameScenePath.Battle);
    }

    public tapItem() {
        this.router.request(GameCommand.MapPick, {}).subscribe(res => {
            this.router.toast(res.data);
        });
    }

    public tapNpc() {
        this.router.request(GameCommand.MapInquire, {}).subscribe(res => {
            
        });
    }

    public tapMap(to: number) {
        this.router.request(GameCommand.MapMove, {map: to}).subscribe(res => {
            
        });
    }

    public tapRoute(item: IGmeRoute) {
        this.router.navigate(item.path);
    }


}
