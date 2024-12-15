import { Component, OnInit } from '@angular/core';
import { TVService } from './tv.service';

@Component({
    standalone: false,
  selector: 'app-tv-backend',
  templateUrl: './tv-backend.component.html',
  styleUrls: ['./tv-backend.component.scss']
})
export class TvBackendComponent implements OnInit {

    public isLoading = false;
    public data: any = {};

    constructor(
        private service: TVService
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
