import { form } from '@angular/forms/signals';
import { Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { IBookSpiderItem } from '../../model';
import { BookService } from '../book.service';

@Component({
    standalone: false,
    selector: 'app-spider',
    templateUrl: './spider.component.html',
    styleUrls: ['./spider.component.scss']
})
export class SpiderComponent implements OnDestroy {
    private readonly service = inject(BookService);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public visible = false;
    public items: IBookSpiderItem[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
    }));

    public isAsync = false;
    public loadProgress = 0;
    public loadTip = '';
    private loadStartAt = new Date();
    private loadHandle = 0;

    ngOnDestroy(): void {
        if (this.loadHandle) {
            clearInterval(this.loadHandle);
        }
    }

    public open() {
        this.visible = true;
    }

    public close() {
        this.visible = false;
    }

    public tapAsync(item: IBookSpiderItem) {
        this.loadStartAt = new Date();
        this.isAsync = true;
        this.loadProgress = 0;
        this.loadTip = '初始化。。。';
        this.service.spiderAsync(item).subscribe({
            next: res => {
                this.loadLoop(res.data);
            },
            error: err => {
                this.toastrService.error(err);
            }
        })
    }

    private loadLoop(data: any) {
        this.loadProgress = data.next * 100 / data.count;
        if (this.loadHandle > 0) {
            clearInterval(this.loadHandle);
        }
        let text = data.next + '/' + data.count + '(预计需要';
        const now = new Date();
        let diff = now.getTime() - this.loadStartAt.getTime();
        let total = Math.ceil((diff / data.next * (data.count - data.next)) / 1000);
        this.loadHandle = window.setInterval(() => {
            let tip = total + '秒';
            if (total > 60) {
                tip = Math.floor(total / 60) + '分' + Math.ceil(total % 60) + '秒';
            }
            this.loadTip = text + tip +')';
            if (total < 1) {
                return;
            }
            total --;
        }, 1000);
        this.service.spiderAsync(data).subscribe({
            next: res => {
                this.loadLoop(res.data);
            },
            error: err => {
                this.toastrService.error(err);
                this.isAsync = false;
                if (this.loadHandle > 0) {
                    clearInterval(this.loadHandle);
                }
            }
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.spiderSearch(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                // this.hasMore = res.paging.more;
                // this.total = res.paging.total;
                this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }
}
