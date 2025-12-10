import { Component, OnInit, inject } from '@angular/core';
import { DiskService } from './disk.service';

@Component({
    standalone: false,
    selector: 'app-disk-backend',
    templateUrl: './disk-backend.component.html',
    styleUrls: ['./disk-backend.component.scss']
})
export class DiskBackendComponent implements OnInit {
    private service = inject(DiskService);


    public isLoading = true;
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
