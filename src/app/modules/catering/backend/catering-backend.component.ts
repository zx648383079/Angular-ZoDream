import { Component, OnInit } from '@angular/core';
import { CateringBackendService } from './catering.service';

@Component({
    standalone: false,
  selector: 'app-catering-backend',
  templateUrl: './catering-backend.component.html',
  styleUrls: ['./catering-backend.component.scss']
})
export class CateringBackendComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: CateringBackendService
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
