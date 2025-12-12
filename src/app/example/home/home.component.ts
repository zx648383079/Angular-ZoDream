import { Component, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-example-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class ExampleHomeComponent {

    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    constructor() {
        setTimeout(() => {
            this.isLoading.set(false);
            this.data.set({
                user_today: 100,
                user_yesterday: 5,
                user_count: 2000000,
            });
        }, 2000);
    }

}
