import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { GameMakerService } from '../game-maker.service';
import { ActivatedRoute } from '@angular/router';

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
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.projectStatistics(params.game).subscribe({
                next: res => {
                    this.isLoading = false;
                    this.data = res;
                },
                error: err => {
                    this.toastrService.error(err);
                    history.back();
                }
            });
        });
    }

}
