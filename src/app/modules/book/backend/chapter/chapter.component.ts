import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ChapterTypeItems, IBook, IChapter } from '../../model';
import { BookService } from '../book.service';
import { mapFormat } from '../../../../theme/utils';
import { form } from '@angular/forms/signals';

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

    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20
    }));

    public items: IChapter[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
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
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.chapterList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapSearch() {
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
