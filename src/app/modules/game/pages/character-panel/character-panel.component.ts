import { Component, Inject, OnInit } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameBagItem, IGameCharacter, IGameEquipItem, IGameRouter, IGameScene } from '../../model';

@Component({
    standalone: false,
  selector: 'app-character-panel',
  templateUrl: './character-panel.component.html',
  styleUrls: ['./character-panel.component.scss']
})
export class CharacterPanelComponent implements IGameScene, OnInit {

    public data: IGameCharacter;
    public equipItems: IGameEquipItem[] = [];

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) {
        this.data = this.router.character;
    }


    ngOnInit(): void {
        this.router.request(GameCommand.CharacterStatus).subscribe(res => {
            this.data = res.data;
            this.equipItems = res.data.equip_items || [];
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
