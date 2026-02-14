import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    standalone: false,
    selector: 'app-b-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
    private readonly router = inject(Router);

    public goToHome() {
        this.router.navigateByUrl('/');
    }

}
