import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LegworkService } from '../legwork.service';
import { IService } from '../model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: IService;

    constructor(
        private service: LegworkService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.loadService(params.id);
        });
    }

    public loadService(id: any) {
        this.service.service(id).subscribe(res => {
            this.data = res;
        });
    }

}
