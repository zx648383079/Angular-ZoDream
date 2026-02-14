import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook, IBookList, IBookListItem } from '../../model';
import { BookService } from '../../book.service';
import { DialogService } from '../../../../components/dialog';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-list',
    templateUrl: './edit-list.component.html',
    styleUrls: ['./edit-list.component.scss'],
})
export class EditListComponent {
    private readonly service = inject(BookService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataForm = form(signal({
        id: 0,
        title: '',
        description: '',
    }), schemaPath => {
        required(schemaPath.title);
    });

    public readonly items = signal<IBookListItem[]>([]);
    public readonly panelOpen = signal(false);
    public readonly bookItems = signal<IBook[]>([]);
    public readonly searchForm = form(signal({
        keywords: '',
        page: 1,
    }));

    constructor() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.listDetail(params.id).subscribe(res => {
                this.dataForm().value.set({
                    id: res.id,
                    title: res.title,
                    description: res.description
                });
                this.items.set(res.items);
            });
        });
    }

    public tapSubmit() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning('请输入名称');
            return;
        }
        const form = this.dataForm().value();
        const data = {
            id: form.id || 0,
            title: form.title,
            description: form.description,
            items: this.items().map(item => {
                return {
                    star: item.star,
                    remark: item.remark,
                    id: item.id || 0,
                    book_id: item.book_id,
                };
            })
        };
        
        if (data.items.length < 1) {
            this.toastrService.warning('请选择书');
            return;
        }
        this.service.listSave(data).subscribe({
            next: res => {
                this.toastrService.success($localize `Save Successfully`);
                this.router.navigate([data.id > 0 ? '../../' : '../'], {relativeTo: this.route});
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapAddTo(book: IBook) {
        for (const item of this.items()) {
            if (item.book_id === item.id) {
                return;
            }
        }
        this.items.update(v => {
            v.push({
                book,
                book_id: book.id,
                remark: '',
                star: 10,
            });
            return [...v];
        });
    }

    public searchEnter(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.tapSearch();
    }

    public tapSearch() {
        this.service.getBookList(this.searchForm().value()).subscribe(res => {
            this.bookItems.set(res.data);
        });
    }
}
