import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook, IBookList, IBookListItem } from '../../model';
import { BookService } from '../../book.service';
import { DialogService } from '../../../../components/dialog';

@Component({
    standalone: false,
    selector: 'app-edit-list',
    templateUrl: './edit-list.component.html',
    styleUrls: ['./edit-list.component.scss'],
})
export class EditListComponent implements OnInit {
    private service = inject(BookService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public data: IBookList = {
        title: '',
        description: '',
    } as any;

    public items: IBookListItem[] = [];
    public panelOpen = false;
    public bookItems: IBook[] = [];
    public keywords = '';

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.listDetail(params.id).subscribe(res => {
                this.data = res;
                this.items = res.items;
            });
        });
    }

    public tapSubmit() {
        const data = {
            id: this.data.id || 0,
            title: this.data.title,
            description: this.data.description,
            items: this.items.map(item => {
                return {
                    star: item.star,
                    remark: item.remark,
                    id: item.id || 0,
                    book_id: item.book_id,
                };
            })
        };
        if (!data.title) {
            this.toastrService.warning('请输入名称');
            return;
        }
        if (data.items.length < 1) {
            this.toastrService.warning('请选择书');
            return;
        }
        this.service.listSave(data).subscribe(res => {
            this.toastrService.success($localize `Save Successfully`);
            this.router.navigate([data.id > 0 ? '../../' : '../'], {relativeTo: this.route});
        });
    }

    public tapAddTo(book: IBook) {
        for (const item of this.items) {
            if (item.book_id === item.id) {
                return;
            }
        }
        this.items.push({
            book,
            book_id: book.id,
            remark: '',
            star: 10,
        });
    }

    public searchEnter(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.tapSearch();
    }

    public tapSearch() {
        this.service.getBookList({
            page: 1,
            keywords: this.keywords,
        }).subscribe(res => {
            this.bookItems = res.data;
        });
    }
}
