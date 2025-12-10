import { Component, OnInit, inject, viewChild } from '@angular/core';
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
    private service = inject(BookService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public readonly contextMenu = viewChild(ContextMenuComponent);
    public items: IBookRecord[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;

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
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
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
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.getHistory({
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
