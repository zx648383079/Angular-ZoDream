import { Component, inject, signal } from '@angular/core';
import { TrackerBackendService } from './tracker.service';

@Component({
    standalone: false,
    selector: 'app-trade-tracker-backend',
    templateUrl: './backend.component.html',
    styleUrls: ['./backend.component.scss']
})
export class TradeTrackerBackendComponent {
    private readonly service = inject(TrackerBackendService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    constructor() { 
        this.service.statistics().subscribe({
            next: res => {
                this.data.set(res);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
