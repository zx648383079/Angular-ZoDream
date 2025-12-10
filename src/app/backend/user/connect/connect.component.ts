import { Component, OnInit, inject } from '@angular/core';
import { IConnect } from '../../../theme/models/auth';
import { UserService } from '../user.service';

@Component({
    standalone: false,
    selector: 'app-connect',
    templateUrl: './connect.component.html',
    styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {
    private service = inject(UserService);


    public items: IConnect[] = [];

    constructor() {
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
