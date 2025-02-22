import { Component, OnInit } from '@angular/core';
import { CheckinService } from './checkin.service';

@Component({
    standalone: false,
  selector: 'app-checkin-backend',
  templateUrl: './checkin-backend.component.html',
  styleUrls: ['./checkin-backend.component.scss']
})
export class CheckinBackendComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: CheckinService,
    ) { }

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
