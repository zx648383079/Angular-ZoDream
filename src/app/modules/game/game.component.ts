import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { ThemeService } from '../../theme/services';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

    constructor(
        private service: GameService,
        private themeService: ThemeService,
    ) { }

    ngOnInit() {
        
    }

}
