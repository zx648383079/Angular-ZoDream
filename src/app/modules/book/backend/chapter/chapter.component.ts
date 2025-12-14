import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ChapterTypeItems, IBook, IChapter } from '../../model';
import { BookService } from '../book.service';
import { mapFormat } from '../../../../theme/utils';

@Component({
    standalone: false,
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit {
    private readonly service = inject(BookService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);


    public items: IChapter[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;
    public keywords = '';
    public data: IBook;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.book) {
                return;
            }
            this.data = {id: params.book} as any;
            this.tapRefresh();
            this.service.book(params.book).subscribe(res => {
                this.data = res;
            });
        });
    }

    public formatType(val: number) {
        return mapFormat(val, ChapterTypeItems);
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.chapterList({
            keywords: this.keywords,
            book: this.data.id,
            page
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = res.data;
            this.total = res.paging.total;
            this.perPage = res.paging.limit;
        }, () => {
            this.isLoading = false;
        });
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapSearch() {
        this.keywords = form.keywords;
        this.tapRefresh();
    }

    public tapRemove(item: IChapter) {
        if (!confirm('确定删除“' + item.title + '”章节？')) {
            return;
        }
        this.service.chapterRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success($localize `Delete Successfully`);
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

}
