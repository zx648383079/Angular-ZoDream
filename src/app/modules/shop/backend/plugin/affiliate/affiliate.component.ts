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
            this.isInstalled = res.is_installed !== false;
        });
    }

    public onInstallChange() {
        if (this.isInstalled) {
            this.router.navigate(['setting'], {relativeTo: this.route});
        }
    }
}
