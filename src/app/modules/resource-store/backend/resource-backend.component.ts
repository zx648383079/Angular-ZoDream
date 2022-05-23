import { Component, OnInit } from '@angular/core';
import { ResourceService } from './resource.service';

@Component({
  selector: 'app-resource-backend',
  templateUrl: './resource-backend.component.html',
  styleUrls: ['./resource-backend.component.scss']
})
export class ResourceBackendComponent implements OnInit {

    public isLoading = false;
    public data: any = {};

    constructor(
        private service: ResourceService
    ) { }

    ngOnInit() {
        this.service.statistics().subscribe({
            next: res => {
                this.data = res;
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

}
