import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenerateService } from '../generate.service';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {

    public tabIndex = 0;

    constructor(
        private service: GenerateService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.tapTab(parseInt(params.type, 10) || 0);
        });
    }

    public tapTab(i: number) {
        this.tabIndex = i;
    }

}
