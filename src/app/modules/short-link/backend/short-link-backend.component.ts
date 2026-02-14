import { Component, inject, signal } from '@angular/core';
import { ShortLinkService } from './short-link.service';

@Component({
    standalone: false,
    selector: 'app-short-link-backend',
    templateUrl: './short-link-backend.component.html',
    styleUrls: ['./short-link-backend.component.scss']
})
export class ShortLinkBackendComponent {
    private readonly service = inject(ShortLinkService);


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
