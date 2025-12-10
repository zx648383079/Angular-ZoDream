import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogBoxComponent, DialogService } from '../../../components/dialog';
import { AppState } from '../../../theme/interfaces';
import { IErrorResult } from '../../../theme/models/page';
import { IUser } from '../../../theme/models/user';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';
import { emptyValidate } from '../../../theme/validators';
import { BookService } from '../book.service';
import { IAuthorProfile, IBook } from '../model';

@Component({
    standalone: false,
  selector: 'app-book-member',
  templateUrl: './book-member.component.html',
  styleUrls: ['./book-member.component.scss']
})
export class BookMemberComponent implements OnInit {
    private store = inject<Store<AppState>>(Store);
    private service = inject(BookService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public user: IUser;
    public data: IAuthorProfile;
    public bookItems: IBook[] = [];
    public bookData: IBook = {} as IBook;

    constructor() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
        this.service.profile().subscribe(res => {
            this.data = res;
        });
        this.service.selfBookList({}).subscribe(res => {
            this.bookItems = res.data;
        });
    }

    public tapNewBook(modal: DialogBoxComponent) {
        this.bookData = {} as IBook;
        modal.open(() => {
            this.service.selfSaveBook(this.bookData).subscribe({
                next: res => {
                    this.toastrService.success('书籍创建成功，请添加章节');
                    this.router.navigate(['book', res.id], {relativeTo: this.route});
                },
                error: (err: IErrorResult) => {
                    this.toastrService.error(err.error.message);
                }
            });
        }, () => !emptyValidate(this.bookData.name));
    }
}
