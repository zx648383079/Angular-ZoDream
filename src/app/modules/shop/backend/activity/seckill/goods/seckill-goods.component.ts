import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../../components/dialog';
import { IPageQueries } from '../../../../../../theme/models/page';
import { ISeckillGoods } from '../../../../model';
import { SearchService } from '../../../../../../theme/services';
import { ActivityService } from '../../activity.service';

@Component({
    standalone: false,
    selector: 'app-shop-seckill-goods',
    templateUrl: './seckill-goods.component.html',
    styleUrls: ['./seckill-goods.component.scss']
})
export class SeckillGoodsComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ISeckillGoods[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly editForm = form(signal<ISeckillGoods>({
        id: 0,
        act_id: 0,
        time_id: 0,
        goods_id: 0,
        amount: 1,
        every_amount: 1,
        price: 1,
    }));
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        act_id: 0,
        time_id: 0
    }));

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.activity) {
                this.queries.act_id().value.set(parseInt(params.activity, 10));
            }
            if (params.time) {
                this.queries.time_id().value.set(parseInt(params.time, 10));
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }


    /**
     * tapRefresh
     */
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
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.goodsList(queries).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
            this.hasMore = res.paging.more;
            this.total.set(res.paging.total);
            this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”商品？', () => {
            this.service.goodsRemove(item.id).subscribe(res => {
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

    open(modal: DialogEvent, item?: ISeckillGoods) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.act_id = this.queries.act_id().value() as any;
            v.time_id = this.queries.time_id().value() as any;
            v.goods_id = item?.goods_id ?? 0;
            v.amount = item?.amount ?? 1;
            v.every_amount = item?.every_amount ?? 1;
            v.price = item?.price ?? 1;
            return v;
        });
        modal.open(() => {
            this.service.goodsSave(this.editForm().value()).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
    }

}
