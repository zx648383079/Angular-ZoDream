import { Component, OnInit, inject } from '@angular/core';
import { LegworkService } from './legwork.service';

@Component({
    standalone: false,
  selector: 'app-legwork-backend',
  templateUrl: './legwork-backend.component.html',
  styleUrls: ['./legwork-backend.component.scss']
})
export class LegworkBackendComponent implements OnInit {
    private service = inject(LegworkService);


    public isLoading = true;
    public data: any = {};

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

}
