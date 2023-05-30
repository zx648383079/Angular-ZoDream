import { Component, OnInit } from '@angular/core';
import { DialogEvent } from '../../../../components/dialog';
import { ThemeService } from '../../../../theme/services';
import { IGameProject } from '../../model';
import { GameMakerService } from '../game-maker.service';

@Component({
  selector: 'app-maker-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: GameMakerService,
    ) { }

    ngOnInit() {
        // this.service.statistics().subscribe(res => {
        //     this.isLoading = false;
        //     this.data = res;
        // });
    }

}
