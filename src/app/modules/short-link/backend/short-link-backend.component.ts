import { Component, OnInit } from '@angular/core';
import { ShortLinkService } from './short-link.service';

@Component({
  selector: 'app-short-link-backend',
  templateUrl: './short-link-backend.component.html',
  styleUrls: ['./short-link-backend.component.scss']
})
export class ShortLinkBackendComponent implements OnInit {

    public isLoading = false;
    public data: any = {};

    constructor(
        private service: ShortLinkService
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
