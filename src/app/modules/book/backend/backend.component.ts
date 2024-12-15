import { Component, OnInit } from '@angular/core';
import { BookService } from './book.service';

@Component({
    standalone: false,
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: BookService
    ) { }

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
