import { Component, OnInit, inject, signal } from '@angular/core';
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
    private readonly service = inject(BookService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);


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
    public readonly items = signal<IBook[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = signal({
        page: 1,
        per_page: 20
    });

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
        this.goPage(this.queries().page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.getBookList({
            ...this.queries(),
            category: this.category,
            page
        }).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.set(res.data);
                this.total.set(res.paging.total);
                this.queries.update(v => {
                    v.page = page;
                    return v;
                });
            }, 
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
