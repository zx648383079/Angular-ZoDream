import { Component, OnInit, inject, signal } from '@angular/core';
import { LegworkService } from './legwork.service';

@Component({
    standalone: false,
    selector: 'app-legwork-backend',
    templateUrl: './legwork-backend.component.html',
    styleUrls: ['./legwork-backend.component.scss']
})
export class LegworkBackendComponent implements OnInit {
    private readonly service = inject(LegworkService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading.set(false);
            this.data.set(res);
        });
    }

}
