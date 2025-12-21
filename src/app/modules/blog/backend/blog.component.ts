import { Component, OnInit, inject, signal } from '@angular/core';
import { BlogService } from './blog.service';

@Component({
    standalone: false,
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
    private readonly service = inject(BlogService);


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
