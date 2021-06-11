import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IItem } from '../../theme/models/seo';
import { GenerateService } from '../generate.service';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {

    public tabIndex = 0;
    public moduleItems: IItem[] = [];
    public tableItems: IItem[] = [];

    constructor(
        private service: GenerateService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.tapTab(parseInt(params.type, 10) || 0);
        });
        this.service.moduleList().subscribe(res => {
            this.moduleItems = res.data;
        });
        this.service.tableList().subscribe(res => {
            this.tableItems = res.data.map(i => {
                return {
                    name: i,
                    value: i
                };
            });
        });
    }

    public tapTab(i: number) {
        this.tabIndex = i;
    }

}
