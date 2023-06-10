import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AffiliateService } from './affiliate.service';

@Component({
    selector: 'app-affiliate',
    templateUrl: './affiliate.component.html',
    styleUrls: ['./affiliate.component.scss']
})
export class AffiliateComponent implements OnInit {

    public isInstalled = false;
    public isLoading = true;
    public data: any = {};

    constructor(
        private service: AffiliateService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

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
