import { Component, OnInit } from '@angular/core';
import { AdService } from './ad.service';

@Component({
    selector: 'app-ad-sense',
    templateUrl: './ad-sense.component.html',
    styleUrls: ['./ad-sense.component.scss']
})
export class AdSenseComponent implements OnInit {

    public isLoading = false;
    public data: any = {};

    constructor(
        private service: AdService
    ) { }

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
