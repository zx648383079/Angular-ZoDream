import { Component, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { GameMakerService } from '../game-maker.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    standalone: false,
    selector: 'app-maker-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    private readonly service = inject(GameMakerService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    constructor() {
        this.route.params.subscribe(params => {
            this.service.projectStatistics(params.game).subscribe({
                next: res => {
                    this.isLoading.set(false);
                    this.data.set(res);
                },
                error: err => {
                    this.toastrService.error(err);
                    this.location.back();
                }
            });
        });
    }

}
