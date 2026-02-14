import { Component, inject, signal } from '@angular/core';
import { OpenService } from './open.service';

@Component({
    standalone: false,
    selector: 'app-open',
    templateUrl: './open.component.html',
    styleUrls: ['./open.component.scss']
})
export class OpenComponent {
    private readonly service = inject(OpenService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    constructor() {
        this.service.statistics().subscribe(res => {
            this.isLoading.set(false);
            this.data.set(res);
        });
    }

}
