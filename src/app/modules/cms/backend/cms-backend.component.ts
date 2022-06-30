import { Component, OnInit } from '@angular/core';
import { CmsService } from './cms.service';

@Component({
  selector: 'app-cms-backend',
  templateUrl: './cms-backend.component.html',
  styleUrls: ['./cms-backend.component.scss']
})
export class CmsBackendComponent implements OnInit {


    public isLoading = false;
    public data: any = {};

    constructor(
        private service: CmsService
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
