import { Component, inject, signal } from '@angular/core';
import { NavigationService } from './navigation.service';

@Component({
    standalone: false,
    selector: 'app-navigation-backend',
    templateUrl: './navigation-backend.component.html',
    styleUrls: ['./navigation-backend.component.scss']
})
export class NavigationBackendComponent {
    private readonly service = inject(NavigationService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    constructor() {
        this.service.statistics().subscribe(res => {
            this.isLoading.set(false);
            this.data.set(res);
        });
    }

}
