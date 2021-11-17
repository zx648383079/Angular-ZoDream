import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: BackendService,
    ) {
    }

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }
}
