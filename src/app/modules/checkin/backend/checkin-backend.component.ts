import { Component, OnInit, inject, signal } from '@angular/core';
import { CheckinService } from './checkin.service';

@Component({
    standalone: false,
    selector: 'app-checkin-backend',
    templateUrl: './checkin-backend.component.html',
    styleUrls: ['./checkin-backend.component.scss']
})
export class CheckinBackendComponent implements OnInit {
    private readonly service = inject(CheckinService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    ngOnInit() {
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
