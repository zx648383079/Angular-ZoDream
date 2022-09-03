import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
    selector: 'app-authorize',
    templateUrl: './authorize.component.html',
    styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {

    constructor(
        private service: UserService
    ) { }

    ngOnInit() {
    }

}
