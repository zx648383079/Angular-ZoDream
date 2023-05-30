import { Component, OnInit } from '@angular/core';
import { DialogEvent } from '../../../../components/dialog';
import { ThemeService } from '../../../../theme/services';
import { IGameProject } from '../../model';
import { GameMakerService } from '../game-maker.service';

@Component({
    selector: 'app-game-list',
    templateUrl: './game-list.component.html',
    styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

    public items: IGameProject[] = [];
    public editData: IGameProject = {} as any;

    constructor(
        private service: GameMakerService,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle($localize `Game Maker`);
    }

    ngOnInit() {
    }

    public open(modal: DialogEvent, item?: IGameProject) {
        this.editData = item ? {...item} : {} as any;
        modal.open(() => {
            this.items.push(this.editData);
        });
    }

}
