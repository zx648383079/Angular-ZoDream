import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { IGameProject } from '../model';
import { ThemeService } from '../../../theme/services';

@Component({
    selector: 'app-piazza',
    templateUrl: './piazza.component.html',
    styleUrls: ['./piazza.component.scss']
})
export class PiazzaComponent implements OnInit {

    public items: IGameProject[] = [
        {id: 1, name: 'test', logo: '/assets/images/logo.png', description: ''}
    ];

    constructor(
        private service: GameService,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle($localize `Piazza of Games`);
    }

    ngOnInit() {
        this.service.projectList().subscribe(res => {
            this.items = res.data;
        });
    }

}
