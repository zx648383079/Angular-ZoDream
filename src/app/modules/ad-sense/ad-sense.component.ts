import { Component, OnInit, inject, signal } from '@angular/core';
import { AdService } from './ad.service';

@Component({
    standalone: false,
    selector: 'app-ad-sense',
    templateUrl: './ad-sense.component.html',
    styleUrls: ['./ad-sense.component.scss']
})
export class AdSenseComponent implements OnInit {
    private readonly service = inject(AdService);


    public readonly isLoading = signal(false);
    public readonly data = signal<any>({});

    ngOnInit() {
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
