import { Component, OnInit, inject } from '@angular/core';
import { BookService } from './book.service';

@Component({
    standalone: false,
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnInit {
    private readonly service = inject(BookService);


    public isLoading = true;
    public data: any = {};

    ngOnInit(): void {
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
