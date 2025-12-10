import { Component, OnInit, inject } from '@angular/core';
import { CmsService } from './cms.service';

@Component({
    standalone: false,
  selector: 'app-cms-backend',
  templateUrl: './cms-backend.component.html',
  styleUrls: ['./cms-backend.component.scss']
})
export class CmsBackendComponent implements OnInit {
    private service = inject(CmsService);



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
