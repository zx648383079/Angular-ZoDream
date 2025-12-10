import { Component, OnInit, inject } from '@angular/core';
import { AppService } from './app.service';

@Component({
    standalone: false,
  selector: 'app-app-backend',
  templateUrl: './app-backend.component.html',
  styleUrls: ['./app-backend.component.scss']
})
export class AppBackendComponent implements OnInit {
    private service = inject(AppService);


    public isLoading = false;
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
