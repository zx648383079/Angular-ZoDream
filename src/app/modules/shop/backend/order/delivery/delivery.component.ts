import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
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
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IDelivery[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public statusItems = [
        '已下单', '出库中', '已揽收', '运输中', '派送中', '已签收', '已取消'
    ];
    public readonly logisticsOpen = signal(false);
    public readonly logisticsData = signal({
        items: [],
        data: null,
    });
    public readonly logisticsForm = form(signal({
        status: '0',
        content: '',
        time: '',
    }));

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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
        this.logisticsForm().value.update(v => {
            if (this.logisticsData().items.length > 0) {
                v.status = this.logisticsData().items[0].status;
            }
            if (emptyValidate(v.time)) {
                v.time = formatTime(new Date());
            }
            return v;
        });
        this.logisticsOpen.set(true);
    }

    public tapAddLogistics() {
        const item = this.logisticsData().data;
        const data = this.formatJson<IDeliveryLogistics>(item.logistics_content);
        data.push(this.logisticsForm().value() as any);
        this.logisticsData.update(v => {
            return {...v, items: this.formatLogistics(data)}
        });
        this.logisticsOpen.set(false);
        this.service.deliverySave({
            id: item.id,
            logistics_content: data,
            status: this.logisticsForm.status().value(),
        }).subscribe({
            next: res => {
                for (const item of this.items()) {
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
        this.logisticsData.update(v => {
            v.data = item;
            v.items = this.formatLogistics(this.formatJson<IDeliveryLogistics>(item.logistics_content));
            return v;
        });
        modal.open();
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
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.deliveryList(queries).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
            this.hasMore = res.paging.more;
            this.total.set(res.paging.total);
            this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.title + '”发货单？', () => {
            this.service.deliveryRemove(item.id).subscribe(res => {
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
