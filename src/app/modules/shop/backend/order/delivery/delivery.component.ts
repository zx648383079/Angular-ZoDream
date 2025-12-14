import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { IDelivery, IDeliveryLogistics } from '../../../model';
import { SearchService } from '../../../../../theme/services';
import { formatTime, mapFormat } from '../../../../../theme/utils';
import { OrderService } from '../order.service';
import { emptyValidate } from '../../../../../theme/validators';

@Component({
    standalone: false,
    selector: 'app-delivery',
    templateUrl: './delivery.component.html',
    styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
    private readonly service = inject(OrderService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: IDelivery[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public statusItems = [
        '已下单', '出库中', '已揽收', '运输中', '派送中', '已签收', '已取消'
    ];
    public logisticsData = {
        items: [],
        data: null,
        open: false,
        status: 0,
        content: '',
        time: '',
    };

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public formatStatus(value: number) {
        return mapFormat(value, this.statusItems);
    }

    public formatStatusIcon(value: number) {
        return 'icon-check';
    }

    public tapOpenAdd() {
        if (this.logisticsData.items.length > 0) {
            this.logisticsData.status = this.logisticsData.items[0].status;
        }
        if (emptyValidate(this.logisticsData.time)) {
            this.logisticsData.time = formatTime(new Date());
        }
        this.logisticsData.open = true;
    }

    public tapAddLogistics() {
        const item = this.logisticsData.data;
        const data = this.formatJson<IDeliveryLogistics>(item.logistics_content);
        data.push({
            status: this.logisticsData.status,
            content: this.logisticsData.content,
            time: this.logisticsData.time
        });
        this.logisticsData.items = this.formatLogistics(data);
        this.logisticsData.open = false;
        this.service.deliverySave({
            id: item.id,
            logistics_content: data,
            status: this.logisticsData.status,
        }).subscribe({
            next: res => {
                for (const item of this.items) {
                    if (item.id == res.id) {
                        item.logistics_content = res.logistics_content;
                        item.status = res.status;
                    }
                }
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapLogistics(modal: DialogEvent, item: any) {
        this.logisticsData.data = item;
        this.logisticsData.items = this.formatLogistics(this.formatJson<IDeliveryLogistics>(item.logistics_content));
        modal.open();
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

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.deliveryList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            this.searchService.applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.title + '”发货单？', () => {
            this.service.deliveryRemove(item.id).subscribe(res => {
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

    private formatJson<T>(items: any): T[] {
        if (!items) {
            return [];
        }
        if (typeof items === 'object') {
            return items;
        }
        return JSON.parse(items);
    }

    private formatLogistics(items: IDeliveryLogistics[]) {
        if (!items || items.length < 1) {
            return [];
        }
        items = items.reverse();
        let group = {
            status: items[0].status,
            items: []
        };
        const groups = [group];
        for (const item of items) {
            if (item.status == group.status) {
                group.items.push(item);
                continue;
            }
            group = {
                status: item.status,
                items: [item]
            };
            groups.push(group);
        }
        return groups;
    }

}
