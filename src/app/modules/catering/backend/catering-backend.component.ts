import { Component, OnInit, inject, signal } from '@angular/core';
import { CateringBackendService } from './catering.service';

@Component({
    standalone: false,
    selector: 'app-catering-backend',
    templateUrl: './catering-backend.component.html',
    styleUrls: ['./catering-backend.component.scss']
})
export class CateringBackendComponent implements OnInit {
    private readonly service = inject(CateringBackendService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    ngOnInit(): void {
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
