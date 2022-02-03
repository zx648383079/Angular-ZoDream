import { Component, OnInit } from '@angular/core';
import { OpenService } from './open.service';

@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.scss']
})
export class OpenComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: OpenService,
    ) { }

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

}
