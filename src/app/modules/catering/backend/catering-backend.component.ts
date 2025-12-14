import { Component, OnInit, inject } from '@angular/core';
import { CateringBackendService } from './catering.service';

@Component({
    standalone: false,
  selector: 'app-catering-backend',
  templateUrl: './catering-backend.component.html',
  styleUrls: ['./catering-backend.component.scss']
})
export class CateringBackendComponent implements OnInit {
    private readonly service = inject(CateringBackendService);


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
