import { Component, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
    standalone: false,
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
    private readonly service = inject(AuthService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    constructor() {
        this.service.statistics().subscribe({
            next: res => {
                this.data.set(res);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
