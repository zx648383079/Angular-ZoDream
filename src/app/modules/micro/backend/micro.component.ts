import { Component, OnInit } from '@angular/core';
import { MicroService } from './micro.service';

@Component({
    standalone: false,
  selector: 'app-micro',
  templateUrl: './micro.component.html',
  styleUrls: ['./micro.component.scss']
})
export class MicroComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: MicroService,
    ) { }

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

}
