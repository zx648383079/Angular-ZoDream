import { Component, OnInit, inject } from '@angular/core';
import { AdService } from './ad.service';

@Component({
    standalone: false,
    selector: 'app-ad-sense',
    templateUrl: './ad-sense.component.html',
    styleUrls: ['./ad-sense.component.scss']
})
export class AdSenseComponent implements OnInit {
    private readonly service = inject(AdService);


    public isLoading = false;
    public data: any = {};

    ngOnInit() {
        this.service.statistics().subscribe({
            next: res => {
                this.data = res;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
