import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
    standalone: false,
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: AuthService,
    ) {
    }

    ngOnInit() {
        this.service.statistics().subscribe({
            next: res => {
                this.data = res;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
