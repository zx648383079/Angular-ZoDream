import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../theme/services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

    constructor(
        private authService: AuthService,
        private router: Router) {
        this.authService.logout().subscribe(_ => {
            this.router.navigateByUrl('./login');
        });
    }

    ngOnInit() {
    }

}
