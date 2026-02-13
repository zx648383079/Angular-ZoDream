import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook, IChapter } from '../model';
import { BookService } from '../book.service';
import { ButtonEvent } from '../../../components/form';
import { DialogService } from '../../../components/dialog';
import { FileUploadService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-book-detail',
    templateUrl: './book-detail.component.html',
    styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
    private readonly service = inject(BookService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);


    public data: IBook;
    public chapterItems: IChapter[] = [];

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

    public tapDownload(event?: ButtonEvent, zip = false) {
        event?.enter();
        this.uploadService.export(zip ? 'book/download/zip' : 'book/download/txt', 
            {id: this.data.id}, 
            this.data.name + (zip ? '.zip' :'.txt')).subscribe({
            next: _ => {
                event?.reset();
            },
            error: err => {
                event?.reset();
                this.toastrService.error(err);
            }
        });
    }
}
