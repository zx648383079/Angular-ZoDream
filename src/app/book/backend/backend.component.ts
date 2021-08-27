import { Component, OnInit } from '@angular/core';
import { IBook, ICategory } from '../model';
import { IItem } from '../../theme/models/seo';
import { BookService } from './book.service';
import { DialogService } from '../../dialog';
import { IPageQueries } from '../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { applyHistory, getQueries } from '../../theme/query';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnInit {

    public items: IBook[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
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
    public queries: IPageQueries = {
        keywords: '',
        category: 0,
        author: 0,
        classify: 0,
        page: 1,
        per_page: 20,
    };


    constructor(
        private service: BookService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
        this.service.categoryAll().subscribe(res => {
            this.categories = res.data;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.queries = getQueries(res, this.queries);
            this.tapPage();
        });
    }

    public tapSortOut() {
        this.toastrService.confirm('确定整理书籍？', () => {
            let loading = this.toastrService.loading({
                time: 0,
                title: '整理进行中。。。',
                closeable: false,
            });
            this.service.sortOut().subscribe({
                next: () => {
                    this.toastrService.remove(loading);
                    this.toastrService.success('整理完成!');
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.remove(loading);
                    this.toastrService.error(err.error?.message || '整理超时，连接中断！');
                    this.tapRefresh();
                }
            });
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.bookList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IBook) {
        this.toastrService.confirm('确定删除“' + item.name + '”书籍？', () => {
            this.service.bookRemove(item.id).subscribe(res => {
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
}
