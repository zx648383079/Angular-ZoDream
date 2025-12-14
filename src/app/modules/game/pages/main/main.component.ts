import { Component, OnInit, inject } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, GameScenePath, IGameCharacter, IGameMessage, IGameRouter, IGameScene, IGmeRoute } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements IGameScene, OnInit {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public topItems: IGmeRoute[] = [
        {name: '签到', path: 'checkin'},
        {name: '消息', path: GameScenePath.Chat},
        {name: '任务', path: GameScenePath.Task},
    ];
    public bottomItems: IGmeRoute[] = [
        {name: '背包', path: GameScenePath.Bag},
        {name: '组队', path: GameScenePath.TeamPiazza},
        {name: '帮派', path: GameScenePath.OrganizePiazza},
        {name: '副本', path: GameScenePath.MapLevel},
        {name: '冒险', path: GameScenePath.Map},
        {name: '农场', path: GameScenePath.Farm},
        {name: '牧场', path: GameScenePath.Ranch},
        {name: '商店', path: GameScenePath.Store},
        {name: '抽卡', path: GameScenePath.Prize},
        {name: '充值', path: GameScenePath.Recharge},
        {name: '设置', path: GameScenePath.Setting},
    ];
    public character: IGameCharacter;
    public messsageItems: IGameMessage[];

    constructor() {
        this.character = this.router.character;
    }

    ngOnInit(): void {
        this.router.request({
            [GameCommand.CharacterNow]: {},
            [GameCommand.ChatPublic]: {}
        }).subscribe(res => {
            if (res[GameCommand.CharacterNow] && res[GameCommand.CharacterNow].data) {
                this.character = res[GameCommand.CharacterNow].data;
                this.updateCheckIn();
                this.topItems[1].count = this.character.message_count;
                this.bottomItems[1].path = this.character.team_id > 0 ? GameScenePath.Team : GameScenePath.TeamPiazza;
                this.bottomItems[2].path = this.character.org_id > 0 ? GameScenePath.Organize : GameScenePath.OrganizePiazza;
            }
            if (res[GameCommand.ChatPublic] && res[GameCommand.ChatPublic].data) {
                this.messsageItems = res[GameCommand.ChatPublic].data;
            }
        });
    }

    public tapCheckin() {
        if (this.character.is_checked) {
            return;
        }
        this.router.request(GameCommand.CheckinOwn).subscribe(res => {
            this.character.is_checked = true;
            this.updateCheckIn();
            this.router.toast(res.data);
        });
    }

    public tapUpgrade() {
        this.router.request(GameCommand.UpgradeOwn).subscribe(res => {
            this.router.toast('升级成功');
        });
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

    private updateCheckIn() {
        const item = this.topItems[0];
        item.name = this.character.is_checked ? '已签到' : '签到';
        item.disabled = this.character.is_checked;
    }
}
