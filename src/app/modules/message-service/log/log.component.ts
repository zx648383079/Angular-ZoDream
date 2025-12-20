import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { ILog } from '../model';
import { MessageServiceService } from '../ms.service';
import { SearchService } from '../../../theme/services';
import { mapFormat } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-ms-log',
    templateUrl: './log.component.html',
    styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
    private readonly service = inject(MessageServiceService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: ILog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal({
        type: '0',
        page: 1,
        per_page: 20,
        keywords: ''
    }));
    public typeItems = [];

    constructor() {
        this.service.typeItems().subscribe(res => {
            this.typeItems = res;
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public formatStatus(val: number) {
        return mapFormat(val, [
            {name: '队列中', value: 0},
            {name: '发送中', value: 1},
            {name: '发生失败', value: 4},
            {name: '已发送', value: 6},
            {name: '已发送已使用', value: 7},
            {name: '已发送已过期', value: 9},
        ])
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

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.logList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: ILog) {
        this.toastrService.confirm('确定删除本条短信记录？', () => {
            this.service.logRemove(item.id).subscribe(res => {
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

}
