import { Component, OnInit } from '@angular/core';
import { GameMakerService } from './game-maker.service';
import { IGameProject } from '../model';
import { ThemeService } from '../../../theme/services';
import { DialogEvent } from '../../../components/dialog';

@Component({
    selector: 'app-game-maker',
    templateUrl: './game-maker.component.html',
    styleUrls: ['./game-maker.component.scss']
})
export class GameMakerComponent implements OnInit {

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
