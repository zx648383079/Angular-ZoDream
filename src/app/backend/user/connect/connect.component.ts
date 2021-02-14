import { Component, OnInit } from '@angular/core';
import { IConnect } from '../../../theme/models/auth';
import { UserService } from '../user.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

    public items: IConnect[] = [];

    constructor(
        private service: UserService
    ) {
        this.tapRefresh();
    }

    ngOnInit() {
    }

    public tapRefresh() {
        this.service.connect().subscribe(res => {
            this.items = res;
        });
    }

}
