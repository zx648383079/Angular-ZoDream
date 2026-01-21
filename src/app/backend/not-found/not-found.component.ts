import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    standalone: false,
    selector: 'app-b-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
    private readonly router = inject(Router);


    ngOnInit() {
    }

    goToHome() {
        this.router.navigateByUrl('/');
    }

}
