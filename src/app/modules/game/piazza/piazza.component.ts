import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { IGameProject } from '../model';
import { ThemeService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-piazza',
    templateUrl: './piazza.component.html',
    styleUrls: ['./piazza.component.scss']
})
export class PiazzaComponent implements OnInit {

    public items: IGameProject[] = [
        {id: 1, name: 'test', logo: '/assets/images/logo.png', description: 'This is test app, this is an ex for any items in anythings.'}
    ];

    constructor(
        private service: GameService,
        private themeService: ThemeService,
    ) {
        this.themeService.titleChanged.next($localize `Piazza of Games`);
    }

    ngOnInit() {
        this.service.projectList().subscribe(res => {
            this.items = res.data;
        });
    }

}
