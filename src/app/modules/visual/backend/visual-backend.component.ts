import { Component, inject, signal } from '@angular/core';
import { VisualService } from './visual.service';

@Component({
    standalone: false,
    selector: 'app-visual-backend',
    templateUrl: './visual-backend.component.html',
    styleUrls: ['./visual-backend.component.scss']
})
export class VisualBackendComponent {
    private readonly service = inject(VisualService);


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
