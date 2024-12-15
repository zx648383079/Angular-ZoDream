import { Component, OnInit } from '@angular/core';
import { DiskService } from './disk.service';

@Component({
    standalone: false,
    selector: 'app-disk-backend',
    templateUrl: './disk-backend.component.html',
    styleUrls: ['./disk-backend.component.scss']
})
export class DiskBackendComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: DiskService,
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
