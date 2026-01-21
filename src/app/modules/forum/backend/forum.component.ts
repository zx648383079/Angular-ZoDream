import { Component, OnInit, inject, signal } from '@angular/core';
import { ForumService } from './forum.service';

@Component({
    standalone: false,
    selector: 'app-forum-b',
    templateUrl: './forum.component.html',
    styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {
    private readonly service = inject(ForumService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading.set(false);
            this.data.set(res);
        });
    }
}
