import { Component, OnInit, inject, signal } from '@angular/core';
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
    private readonly service = inject(GameMakerService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.projectStatistics(params.game).subscribe({
                next: res => {
                    this.isLoading.set(false);
                    this.data.set(res);
                },
                error: err => {
                    this.toastrService.error(err);
                    history.back();
                }
            });
        });
    }

}
