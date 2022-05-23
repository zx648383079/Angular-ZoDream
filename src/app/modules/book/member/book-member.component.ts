import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogBoxComponent, DialogService } from '../../../components/dialog';
import { AppState } from '../../../theme/interfaces';
import { IErrorResult } from '../../../theme/models/page';
import { IUser } from '../../../theme/models/user';
import { getCurrentUser } from '../../../theme/reducers/auth.selectors';
import { emptyValidate } from '../../../theme/validators';
import { BookService } from '../book.service';
import { IAuthorProfile, IBook } from '../model';

@Component({
  selector: 'app-book-member',
  templateUrl: './book-member.component.html',
  styleUrls: ['./book-member.component.scss']
})
export class BookMemberComponent implements OnInit {

    public user: IUser;
    public data: IAuthorProfile;
    public bookItems: IBook[] = [];
    public bookData: IBook = {} as IBook;

    constructor(
        private store: Store<AppState>,
        private service: BookService,
        private router: Router,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
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
