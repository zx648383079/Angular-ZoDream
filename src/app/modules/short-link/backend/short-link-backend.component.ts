import { Component, OnInit, inject } from '@angular/core';
import { ShortLinkService } from './short-link.service';

@Component({
    standalone: false,
  selector: 'app-short-link-backend',
  templateUrl: './short-link-backend.component.html',
  styleUrls: ['./short-link-backend.component.scss']
})
export class ShortLinkBackendComponent implements OnInit {
    private service = inject(ShortLinkService);


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
