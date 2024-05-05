import { Component, OnInit } from '@angular/core';
import { TrackerBackendService } from './tracker.service';

@Component({
    selector: 'app-trade-tracker-backend',
    templateUrl: './backend.component.html',
    styleUrls: ['./backend.component.scss']
})
export class TradeTrackerBackendComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: TrackerBackendService
    ) { }

    ngOnInit(): void {
        this.service.statistics().subscribe({
            next: res => {
                this.data = res;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
