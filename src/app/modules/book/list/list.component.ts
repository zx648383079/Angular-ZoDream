import { Component, OnInit, inject, signal } from '@angular/core';
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
    private readonly service = inject(BookService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly store = inject<Store<AppState>>(Store);


    public readonly items = signal<IBookList[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = signal({
        page: 1,
        per_page: 20
    });
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
        this.goPage(this.queries().page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.list({
            ...this.queries(),
            page
        }).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.set(res.data);
                this.total.set(res.paging.total);
                this.queries.update(v => {
                    v.page = page;
                    return {...v};
                });
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}