import { Component, OnInit, inject } from '@angular/core';
import { ResourceService } from './resource.service';

@Component({
    standalone: false,
  selector: 'app-resource-backend',
  templateUrl: './resource-backend.component.html',
  styleUrls: ['./resource-backend.component.scss']
})
export class ResourceBackendComponent implements OnInit {
    private service = inject(ResourceService);


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
