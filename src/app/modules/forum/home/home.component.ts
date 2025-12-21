import { Component, OnInit, inject, signal } from '@angular/core';
import { IForum } from '../model';
import { ForumService } from '../forum.service';

@Component({
    standalone: false,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private readonly service = inject(ForumService);


    public readonly items = signal<IForum[]>([]);
    public readonly isLoading = signal(false);

    ngOnInit() {
        this.isLoading.set(true);
        this.service.getForumList().subscribe({
            next: res => {
                this.items.set(res);
                this.isLoading.set(false);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

}
