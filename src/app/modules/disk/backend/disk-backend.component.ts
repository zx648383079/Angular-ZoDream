import { Component, inject, signal } from '@angular/core';
import { DiskService } from './disk.service';

@Component({
    standalone: false,
    selector: 'app-disk-backend',
    templateUrl: './disk-backend.component.html',
    styleUrls: ['./disk-backend.component.scss']
})
export class DiskBackendComponent {
    private readonly service = inject(DiskService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    constructor() {
        this.service.statistics().subscribe({
            next: res => {
                this.data.set(res);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
