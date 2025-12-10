import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../theme/interfaces';
import { IBookList } from '../model';
import { selectAuthStatus } from '../../../theme/reducers/auth.selectors';
import { BookService } from '../book.service';

@Component({
    standalone: false,
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    private service = inject(BookService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private store = inject<Store<AppState>>(Store);


    public items: IBookList[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;
    public isLogin = true;

    constructor() {
        this.store.select(selectAuthStatus).subscribe(res => {
            this.isLogin = !res.guest;
        });
        this.tapRefresh();
    }

    ngOnInit() {}

    public tapView(item: any) {
        this.router.navigate([item.id], {relativeTo: this.route});
    }

    public tapAdd() {
        this.router.navigate(['create'], {relativeTo: this.route});
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