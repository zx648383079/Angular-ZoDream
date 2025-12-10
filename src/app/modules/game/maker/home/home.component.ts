import { Component, OnInit, inject } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { GameMakerService } from '../game-maker.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    standalone: false,
    selector: 'app-maker-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private service = inject(GameMakerService);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public isLoading = true;
    public data: any = {};

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
