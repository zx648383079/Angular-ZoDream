import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBookList, IBookListItem } from '../../model';
import { BookService } from '../../book.service';
import { DialogService } from '../../../../components/dialog';

@Component({
    standalone: false,
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    private service = inject(BookService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public data: IBookList;

    public items: IBookListItem[] = [];

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

    public tapCollect() {
        this.service.listCollect(this.data.id).subscribe({
            next: res => {
                this.data.is_collected = res.is_collected;
                this.data.collect_count = res.collect_count;
            }, error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapAgree(item: IBookListItem) {
        this.service.listAgree(item.id).subscribe({
            next: res => {
                item.is_agree = res.is_agree;
                item.agree_count = res.agree_count;
                item.disagree_count = res.disagree_count;
            }, error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapDisagree(item: IBookListItem) {
        this.service.listDisagree(item.id).subscribe({
            next: res => {
                item.is_agree = res.is_agree;
                item.agree_count = res.agree_count;
                item.disagree_count = res.disagree_count;
            }, error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapAddBook(item: IBookListItem) {
        this.service.recordHistory(item.book_id, 0, 0).subscribe({
            next: _ => {
                item.on_shelf = true;
            }, error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

}
