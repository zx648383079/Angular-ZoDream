import {
    Component,
    OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook, IChapter } from '../../theme/models/book';
import { BookService } from '../book.service';

@Component({
    selector: 'app-book-detail',
    templateUrl: './book-detail.component.html',
    styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

    public data: IBook;
    public chapterItems: IChapter[] = [];

    constructor(
        private service: BookService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params || !params.id) {
                return;
            }
            this.service.getBook(params.id).subscribe(res => {
                this.data = res;
            });
            this.service.getChapters(params.id, 1, 10000).subscribe(res => {
                this.chapterItems = res.data;
            });
        });
    }

    public tapChapter(item: IChapter) {
        this.router.navigate(['/book/reader/' + this.data.id + '/' + item.id]);
    }

}
