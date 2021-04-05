import {
    Component,
    OnInit
} from '@angular/core';
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
    selector: 'app-chapter',
    templateUrl: './chapter.component.html',
    styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit {

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
