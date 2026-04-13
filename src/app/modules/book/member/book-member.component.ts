import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { AppState } from '../../../theme/interfaces';
import { IErrorResult } from '../../../theme/models/page';
import { IUser } from '../../../theme/models/user';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';
import { BookService } from '../book.service';
import { IAuthorProfile, IBook } from '../model';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-book-member',
    templateUrl: './book-member.component.html',
    styleUrls: ['./book-member.component.scss']
})
export class BookMemberComponent {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly service = inject(BookService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly user = signal<IUser|null>(null);
    public readonly data = signal<IAuthorProfile|null>(null);
    public readonly bookItems = signal<IBook[]>([]);
    public readonly bookForm = form(signal({
        name: '',
        cover: '',
        description: ''
    }), schemaPath => {
        required(schemaPath.name);
    });

    constructor() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user.set(user);
        });
        this.service.profile().subscribe(res => {
            this.data.set(res);
        });
        this.service.selfBookList({}).subscribe(res => {
            this.bookItems.set(res.data);
        });
    }

    public tapNewBook(modal: DialogEvent) {
        this.bookForm().value.set({
            name: '',
            cover: '',
            description: ''
        });
        modal.open(() => {
            this.service.selfSaveBook(this.bookForm().value()).subscribe({
                next: res => {
                    this.toastrService.success('书籍创建成功，请添加章节');
                    this.router.navigate(['book', res.id], {relativeTo: this.route});
                },
                error: (err: IErrorResult) => {
                    this.toastrService.error(err.error.message);
                }
            });
        }, () => this.bookForm().valid());
    }
}
