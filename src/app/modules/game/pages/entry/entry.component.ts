import { Component, Inject, OnInit } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameCharacter, IGameCharacterIdentity, IGameDescent, IGameProject, IGameRouter, IGameScene } from '../../model';
import { IItem } from '../../../../theme/models/seo';
import { ButtonEvent } from '../../../../components/form';
import { emailValidate } from '../../../../theme/validators';

@Component({
    standalone: false,
    selector: 'app-game-entry',
    templateUrl: './entry.component.html',
    styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements IGameScene {

    public step = 0;
    public data = {
        identity_id: 0,
        descent_id: 0,
        sex: 0,
        name: ''
    };
    public sexItems: IItem[] = [
        {name: '男', value: 1},
        {name: '女', value: 2},
    ];
    public identityItems: IGameCharacterIdentity[] = [];
    public descentItems: IGameDescent[] = [];
    public characterItems: IGameCharacter[] = [];
    public project: IGameProject;

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) {
        this.project = this.router.project;
        this.router.request({
            [GameCommand.CharacterQuery]: {},
            [GameCommand.DescentQuery]: {},
        }).subscribe(res => {
            if (res[GameCommand.CharacterQuery]) {
                this.characterItems = res[GameCommand.CharacterQuery].data;
            }
            if (res[GameCommand.DescentQuery]) {
                this.descentItems = res[GameCommand.DescentQuery].data;
            }
        });
    }

    public tapCharacter(item: IGameCharacter) {
        this.router.enter(item.id);
    }

    public tapDescent(item: IGameDescent) {
        this.data.descent_id = item.id;
        this.step = 3;
    }

    public tapIdentity(item: IGameCharacterIdentity) {
        this.data.identity_id = item.id;
        this.step = 3;
    }

    public tapSex(i: number) {
        this.data.sex = i;
        this.step = 4;
    }

    public tapSubmit(e?: ButtonEvent) {
        if (emailValidate(this.data.name)) {
            this.router.toast('昵称必填');
            return;
        }
        e?.enter();
        this.router.request(GameCommand.CharacterCreate, {
            ...this.data
        }).subscribe({
            next: res => {
                e?.reset();
                this.router.enter(res.data.id);
            },
            error: err => {
                e?.reset();
                this.router.toast(err);
            }
        });
    }
}
