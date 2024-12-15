import { Component, OnInit } from '@angular/core';
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

    public items: ILog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        type: 0,
        page: 1,
        per_page: 20,
        keywords: ''
    };
    public typeItems = [];

    constructor(
        private service: MessageServiceService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
        this.service.typeItems().subscribe(res => {
            this.typeItems = res;
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
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
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.logList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
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
