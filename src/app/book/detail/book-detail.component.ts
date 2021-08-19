import {
    Component,
    OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook, IChapter } from '../model';
import { BookService } from '../book.service';
import { DownloadService } from '../../theme/services';

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
        private downloadService: DownloadService,
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

    public tapRead() {
        if (!this.data.first_chapter) {
            return;
        }
        this.tapChapter(this.data.first_chapter);
    }

    public tapChapter(item: IChapter) {
        this.router.navigate(['../reader/' + this.data.id + '/' + item.id], {relativeTo: this.route});
    }

    public tapAddBook() {
        this.service.recordHistory(this.data.id, 0, 0).subscribe(_ => {
            this.data.on_shelf = true;
        });
    }

    public tapDownload(zip = false) {
        if (zip) {
            this.downloadService.export('book/download/zip', {id: this.data.id}, this.data.name + '.zip');
            return;
        }
        this.downloadService.export('book/download/txt', {id: this.data.id}, this.data.name + '.txt');
    }
}
