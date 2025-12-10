import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook, ICategory } from '../model';
import { BookService } from '../book.service';

@Component({
    standalone: false,
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
    private service = inject(BookService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);


    public categories ?: ICategory[] = [];
    public category = 0;
    public barItems = [
        $localize `Recommend`,
        $localize `Readings`,
        $localize `Words`,
        $localize `Finished`,
        $localize `News`,
    ];
    public barIndex = 0;
    public items: IBook[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;

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
        }).subscribe({
            next: res => {
                this.page = page;
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
                this.perPage = res.paging.limit;
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
