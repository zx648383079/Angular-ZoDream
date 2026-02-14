import { Component, inject, signal } from '@angular/core';
import { AdService } from './ad.service';

@Component({
    standalone: false,
    selector: 'app-ad-sense',
    templateUrl: './ad-sense.component.html',
    styleUrls: ['./ad-sense.component.scss']
})
export class AdSenseComponent {
    private readonly service = inject(AdService);


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
