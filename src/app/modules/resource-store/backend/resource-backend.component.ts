import { Component, inject, signal } from '@angular/core';
import { ResourceService } from './resource.service';

@Component({
    standalone: false,
    selector: 'app-resource-backend',
    templateUrl: './resource-backend.component.html',
    styleUrls: ['./resource-backend.component.scss']
})
export class ResourceBackendComponent {
    private readonly service = inject(ResourceService);


    public readonly isLoading = signal(false);
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
