import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../../../theme/models/user';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

    public user: IUser;

    constructor(
        private route: ActivatedRoute,
        private service: AuthService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.userAccount(params.id).subscribe(user => {
                this.user = user;
            });
        });
    }

}
