import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
    selector: 'app-driver',
    templateUrl: './driver.component.html',
    styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {

    constructor(
        private service: UserService
    ) { }

    ngOnInit() {
    }

}
