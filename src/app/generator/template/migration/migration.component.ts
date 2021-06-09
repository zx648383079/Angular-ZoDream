import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../dialog';
import { IItem } from '../../../theme/models/seo';
import { GenerateService } from '../../generate.service';

@Component({
  selector: 'app-migration',
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.scss']
})
export class MigrationComponent implements OnInit {

    public tableItems: IItem[] = [];

    public selected: string[] = [];

    constructor(
        private service: GenerateService,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.service.tableList().subscribe(res => {
            this.tableItems = res.data.map(i => {
                return {
                    name: i,
                    value: i,
                };
            });
        });
    }

}
