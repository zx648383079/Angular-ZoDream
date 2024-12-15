import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TbkService } from './tbk.service';

@Component({
    standalone: false,
  selector: 'app-tbk',
  templateUrl: './tbk.component.html',
  styleUrls: ['./tbk.component.scss']
})
export class TbkComponent implements OnInit {

    public isInstalled = false;
    public isLoading = true;
    public data: any = {};

    constructor(
        private service: TbkService,
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
