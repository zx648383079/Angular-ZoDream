import { Component, inject, signal } from '@angular/core';
import {
    IBook,
    IChapter
} from '../model';
import {
    BookService
} from '../book.service';
import {
    Router,
    ActivatedRoute
} from '@angular/router';

@Component({
    standalone: false,
    selector: 'app-chapter',
    templateUrl: './chapter.component.html',
    styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent {
    private readonly service = inject(BookService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);


    public readonly data = signal<IBook|null>(null);
    public readonly chapterItems = signal<IChapter[]>([]);

    constructor() {
        this.route.params.subscribe(params => {
            if (!params || !params.id) {
                return;
            }
            this.service.getBook(params.id).subscribe(res => {
                this.data.set(res);
            });
            this.service.getChapters(params.id, 1, 10000).subscribe(res => {
                this.chapterItems.set(res.data);
            });
        });
    }


    public tapChapter(item: IChapter) {
        this.router.navigate(['/book/reader', this.data()!.id, item.id]);
    }

}
