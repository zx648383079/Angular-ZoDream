import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook, IBookRecord } from '../model';
import { BookService } from '../book.service';
import { ContextMenuComponent } from '../../context-menu';
import { DialogService } from '../../dialog';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;
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
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.tapRefresh();
    }

    public tapContextMenu(e: PointerEvent, item: IBookRecord) {
        return this.contextMenu.show(e, [
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
            this.service.removeHistory(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
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
