import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-app-backend',
  templateUrl: './app-backend.component.html',
  styleUrls: ['./app-backend.component.scss']
})
export class AppBackendComponent implements OnInit {

    public isLoading = false;
    public data: any = {};

    constructor(
        private service: AppService
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
