import { Component, OnInit, inject } from '@angular/core';
import { TrackerBackendService } from './tracker.service';

@Component({
    standalone: false,
    selector: 'app-trade-tracker-backend',
    templateUrl: './backend.component.html',
    styleUrls: ['./backend.component.scss']
})
export class TradeTrackerBackendComponent implements OnInit {
    private service = inject(TrackerBackendService);


    public isLoading = true;
    public data: any = {};

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
