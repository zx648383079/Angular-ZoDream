import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBook, ICategory } from '../../theme/models/book';
import { BookService } from '../book.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

    public categories ?: ICategory[] = [];
    public category = 0;
    public barItems = [
        '推荐榜',
        '阅读榜',
        '字数榜',
        '完本榜',
        '新书榜',
    ];
    public barIndex = 0;
    public items: IBook[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;

    constructor(
        private service: BookService,
        private router: Router
    ) {}

    ngOnInit() {
        this.service.categories().subscribe(res => {
            this.categories = res;
        });
        this.tapRefresh();
    }

    public tapCat(item ?: ICategory) {
        this.category = item ? item.id : 0;
    }

    public tapBar(i: number) {
        this.barIndex = i;
    }

    public tapBook(item: IBook) {

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
        this.service.getBookList({
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
