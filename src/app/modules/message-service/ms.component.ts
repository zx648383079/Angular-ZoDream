import { Component, inject, signal } from '@angular/core';
import { MessageServiceService } from './ms.service';

@Component({
    standalone: false,
    selector: 'app-message-service',
    templateUrl: './ms.component.html',
    styleUrls: ['./ms.component.scss']
})
export class MessageServiceComponent {
    private readonly service = inject(MessageServiceService);


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
