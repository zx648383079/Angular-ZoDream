import { Component, inject, signal } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
    standalone: false,
    selector: 'app-b-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    private readonly service = inject(BackendService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});
    public debugKey = '';

    constructor() {
        this.service.statistics().subscribe(res => {
            this.isLoading.set(false);
            this.data.set(res);
        });
    }

    public onKey(e: KeyboardEvent) {
        this.debugKey = e.key;
    }
}
