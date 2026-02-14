import { Component, inject, signal } from '@angular/core';
import { AppService } from './app.service';

@Component({
    standalone: false,
    selector: 'app-app-backend',
    templateUrl: './app-backend.component.html',
    styleUrls: ['./app-backend.component.scss']
})
export class AppBackendComponent {
    private readonly service = inject(AppService);


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
