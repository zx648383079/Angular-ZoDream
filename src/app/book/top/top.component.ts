import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook, ICategory } from '../model';
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
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.category) {
                this.category = params.category;
            }
            this.tapRefresh();
        });
        this.service.categories().subscribe(res => {
            this.categories = res;
        });
    }

    public tapCat(item ?: ICategory) {
        this.category = item ? item.id : 0;
        this.tapRefresh();
    }

    public tapBar(i: number) {
        this.barIndex = i;
    }

    public tapBook(item: IBook) {
        this.router.navigate(['../' + item.id], {relativeTo: this.route});
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
            category: this.category,
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
