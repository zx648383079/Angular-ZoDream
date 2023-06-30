import { Component, Inject, OnInit } from '@angular/core';
import { GameRouterInjectorToken, GameScenePath, IGameRouter, IGameScene, IGmeRoute } from '../../model';

@Component({
    selector: 'app-game-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements IGameScene {

    public topItems: IGmeRoute[] = [
        {name: '签到', path: 'checkin'},
        {name: '消息', path: GameScenePath.Chat, count: 1},
        {name: '任务', path: GameScenePath.Task},

    ];
    public bottomItems: IGmeRoute[] = [
        {name: '背包', path: GameScenePath.Bag},
        {name: '组队', path: GameScenePath.Task},
        {name: '帮派', path: GameScenePath.Organize},
        {name: '副本', path: GameScenePath.MapLevel},
        {name: '冒险', path: GameScenePath.Map},
        {name: '农场', path: GameScenePath.Farm},
        {name: '牧场', path: GameScenePath.Ranch},
        {name: '商店', path: GameScenePath.Store},
        {name: '抽卡', path: GameScenePath.Prize},
        {name: '充值', path: GameScenePath.Recharge},
        {name: '设置', path: GameScenePath.Setting},
    ];

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    public tapCheckin() {
        this.router.toast('签到成功');
        this.router.toast('获取 牛肉 x1');
        this.router.toast('获取 金钱 x1');
    }

    public tapUpgrade() {
        this.router.toast('升级成功');
    }

    public tapRoute(item: IGmeRoute) {
        if (item.path === 'checkin') {
            this.tapCheckin();
            return;
        }
        this.navigate(item.path);
    }

    public navigate(path: string) {
        this.router.navigate(path);
    }
}
