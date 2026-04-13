import { Component, inject, signal } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameBagItem, IGameCharacter, IGameEquipItem, IGameRouter, IGameScene } from '../../model';

@Component({
    standalone: false,
    selector: 'app-character-panel',
    templateUrl: './character-panel.component.html',
    styleUrls: ['./character-panel.component.scss']
})
export class CharacterPanelComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public readonly data = signal<IGameCharacter|null>(null);
    public readonly equipItems = signal<IGameEquipItem[]>([]);

    constructor() {
        this.data.set(this.router.character);
        this.router.request(GameCommand.CharacterStatus).subscribe(res => {
            this.data.set(res.data!);
            this.equipItems.set(res.data!.equip_items || []);
        });
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapUpgrade() {
        this.router.request(GameCommand.UpgradeOwn).subscribe(res => {
            this.router.toast('升级成功');
        });
    }

}
