import { Component, OnInit } from '@angular/core';
import { LegworkService } from './legwork.service';

@Component({
    standalone: false,
  selector: 'app-legwork-backend',
  templateUrl: './legwork-backend.component.html',
  styleUrls: ['./legwork-backend.component.scss']
})
export class LegworkBackendComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: LegworkService,
    ) { }

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

}
