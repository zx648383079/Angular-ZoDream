import { Component, OnInit, inject, signal } from '@angular/core';
import { TVService } from './tv.service';

@Component({
    standalone: false,
    selector: 'app-tv-backend',
    templateUrl: './tv-backend.component.html',
    styleUrls: ['./tv-backend.component.scss']
})
export class TvBackendComponent implements OnInit {
    private readonly service = inject(TVService);


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
