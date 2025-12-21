import { Component, OnInit, inject, signal } from '@angular/core';
import { MicroService } from './micro.service';

@Component({
    standalone: false,
    selector: 'app-micro',
    templateUrl: './micro.component.html',
    styleUrls: ['./micro.component.scss']
})
export class MicroComponent implements OnInit {
    private readonly service = inject(MicroService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading.set(false);
            this.data.set(res);
        });
    }

}
