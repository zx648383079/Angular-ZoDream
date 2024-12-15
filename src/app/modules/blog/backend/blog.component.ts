import { Component, OnInit } from '@angular/core';
import { BlogService } from './blog.service';

@Component({
    standalone: false,
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: BlogService
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
