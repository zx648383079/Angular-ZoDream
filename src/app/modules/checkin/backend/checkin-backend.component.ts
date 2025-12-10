import { Component, OnInit, inject } from '@angular/core';
import { CheckinService } from './checkin.service';

@Component({
    standalone: false,
  selector: 'app-checkin-backend',
  templateUrl: './checkin-backend.component.html',
  styleUrls: ['./checkin-backend.component.scss']
})
export class CheckinBackendComponent implements OnInit {
    private service = inject(CheckinService);


    public isLoading = true;
    public data: any = {};

    ngOnInit() {
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
