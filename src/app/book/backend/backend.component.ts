import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IBook, ICategory } from '../../theme/models/book';
import { IItem } from '../../theme/models/seo';
import { BookService } from './book.service';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnInit {

    public items: IBook[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;
    public keywords = '';
    public categories: ICategory[] = [];
    public classifyItems: IItem[] = [
        {
            name: '无分级',
            value: 0,
        },
        {
            name: '成人级',
            value: 1,
        },
    ];
    public classify = 0;
    public category = 0;
    public author = 0;

    constructor(
        private service: BookService,
        private toastrService: ToastrService,
    ) {}

    ngOnInit() {
        this.tapRefresh();
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
        this.service.bookList({
            keywords: this.keywords,
            category: this.category,
            classify: this.classify,
            author: this.author,
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

    public tapPage() {
        this.goPage(this.page);
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
        this.category = form.cat_id || 0;
        this.classify = form.classify || 0;
        this.author = 0;
        this.tapRefresh();
    }

    public tapRemove(item: IBook) {
        if (!confirm('确定删除“' + item.name + '”书籍？')) {
            return;
        }
        this.service.bookRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }
}
