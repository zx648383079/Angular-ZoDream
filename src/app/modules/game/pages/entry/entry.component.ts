import { Component, OnInit, inject, signal } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameCharacter, IGameCharacterIdentity, IGameDescent, IGameProject, IGameRouter, IGameScene } from '../../model';
import { IItem } from '../../../../theme/models/seo';
import { ButtonEvent } from '../../../../components/form';
import { emailValidate } from '../../../../theme/validators';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-game-entry',
    templateUrl: './entry.component.html',
    styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public step = 0;
    public readonly dataForm = form(signal({
        identity_id: 0,
        descent_id: 0,
        sex: 0,
        name: ''
    }), schemaPath => {
        required(schemaPath.name);
    });
    public sexItems: IItem[] = [
        {name: '男', value: 1},
        {name: '女', value: 2},
    ];
    public identityItems: IGameCharacterIdentity[] = [];
    public descentItems: IGameDescent[] = [];
    public characterItems: IGameCharacter[] = [];
    public project: IGameProject;

    constructor() {
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
        this.dataForm.descent_id().value.set(item.id);
        this.step = 3;
    }

    public tapIdentity(item: IGameCharacterIdentity) {
        this.dataForm.identity_id().value.set(item.id);
        this.step = 3;
    }

    public tapSex(i: number) {
        this.dataForm.sex().value.set(i);
        this.step = 4;
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.router.toast('昵称必填');
            return;
        }
        e?.enter();
        this.router.request(GameCommand.CharacterCreate, {
            ...this.dataForm().value()
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
