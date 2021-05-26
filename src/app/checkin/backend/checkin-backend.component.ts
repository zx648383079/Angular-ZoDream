import { Component, OnInit } from '@angular/core';
import { CheckinService } from './checkin.service';

@Component({
  selector: 'app-checkin-backend',
  templateUrl: './checkin-backend.component.html',
  styleUrls: ['./checkin-backend.component.scss']
})
export class CheckinBackendComponent implements OnInit {

    public data: any = {};

    constructor(
        private service: CheckinService,
    ) { }

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.data = res;
        });
    }

}
