import { Component, OnInit, inject, signal } from '@angular/core';
import { BookService } from './book.service';

@Component({
    standalone: false,
    selector: 'app-backend',
    templateUrl: './backend.component.html',
    styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnInit {
    private readonly service = inject(BookService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    ngOnInit(): void {
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
