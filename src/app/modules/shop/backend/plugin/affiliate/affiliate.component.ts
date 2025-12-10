import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AffiliateService } from './affiliate.service';

@Component({
    standalone: false,
    selector: 'app-affiliate',
    templateUrl: './affiliate.component.html',
    styleUrls: ['./affiliate.component.scss']
})
export class AffiliateComponent implements OnInit {
    private service = inject(AffiliateService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);


    public isInstalled = false;
    public isLoading = true;
    public data: any = {};

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
            this.isInstalled = true;//res.is_installed !== false;
        });
    }

    public onInstallChange() {
        this.service.pluginToggle().subscribe(res => {
            if (res.status === 1) {
                this.router.navigate(['setting'], {relativeTo: this.route});
            }
        });
    }
}
