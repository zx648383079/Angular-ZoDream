import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook, IBookRecord } from '../model';
import { BookService } from '../book.service';
import { ContextMenuComponent } from '../../../components/context-menu';
import { DialogService } from '../../../components/dialog';

@Component({
    standalone: false,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private readonly service = inject(BookService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly contextMenu = viewChild(ContextMenuComponent);
    public readonly items = signal<IBookRecord[]>([]);
    public readonly hasMore = signal(false);
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = signal({
        page: 1,
        per_page: 20
    });

    ngOnInit() {
        this.tapRefresh();
    }

    public tapContextMenu(e: MouseEvent, item: IBookRecord) {
        return this.contextMenu().show(e, [
            {
                icon: 'icon-trash',
                name: '删除',
                onTapped: () => {
                    this.tapRemove(item);
                }
            }
        ]);
    }

    public tapRemove(item: IBookRecord) {
        this.toastrService.confirm('确定将《' + item.book?.name + '》移出书架？', () => {
            this.service.removeHistory(item.book_id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
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
        this.goPage(this.queries().page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        this.service.getHistory({
            ...this.queries(),
            page
        }).subscribe({
            next: res => {
                this.hasMore.set(res.paging.more);
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
