import {
    Component,
    OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { IBookList } from '../../theme/models/book';
import { BookService } from '../book.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    public items: IBookList[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;

    constructor(
        private service: BookService,
        private router: Router,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {}

    public tapView(item: any) {
        this.router.navigate(['/book/list/' + item.id]);
    }

    public tapAdd() {
        this.router.navigate(['/book/list/create']);
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
        this.service.list({
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

}