import { Component, OnInit, inject, signal } from '@angular/core';
import { CmsService } from './cms.service';

@Component({
    standalone: false,
    selector: 'app-cms-backend',
    templateUrl: './cms-backend.component.html',
    styleUrls: ['./cms-backend.component.scss']
})
export class CmsBackendComponent implements OnInit {
    private readonly service = inject(CmsService);



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
