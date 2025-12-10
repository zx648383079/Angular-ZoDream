import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../theme/services';
import { Router } from '@angular/router';

@Component({
    standalone: false,
    selector: 'app-auth-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);


    constructor() {
        this.authService.logout().subscribe(_ => {
            this.router.navigateByUrl('./login');
        });
    }

    ngOnInit() {
    }

}
