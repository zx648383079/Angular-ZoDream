import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook, IBookRecord } from '../model';
import { BookService } from '../book.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public items: IBookRecord[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;

    constructor(
        private service: BookService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.tapRefresh();
    }

    public tapRead(item: IBookRecord) {
        this.router.navigate(['./reader/' + item.book_id + '/' + item.chapter_id], {relativeTo: this.route});
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
        this.service.getHistory({
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
