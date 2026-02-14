import { Component, inject, signal } from '@angular/core';
import { BookService } from './book.service';

@Component({
    standalone: false,
    selector: 'app-backend',
    templateUrl: './backend.component.html',
    styleUrls: ['./backend.component.scss']
})
export class BackendComponent {
    private readonly service = inject(BookService);


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
