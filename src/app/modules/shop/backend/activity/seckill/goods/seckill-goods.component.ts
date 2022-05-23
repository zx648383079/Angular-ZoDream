import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../../../../components/dialog';
import { IPageQueries } from '../../../../../../theme/models/page';
import { ISeckillGoods } from '../../../../model';
import { applyHistory, getQueries } from '../../../../../../theme/query';
import { ActivityService } from '../../activity.service';

@Component({
  selector: 'app-seckill-goods',
  templateUrl: './seckill-goods.component.html',
  styleUrls: ['./seckill-goods.component.scss']
})
export class SeckillGoodsComponent implements OnInit {

    public items: ISeckillGoods[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public editData: ISeckillGoods = {} as any;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        act_id: 0,
        time_id: 0
    };

    constructor(
        private service: ActivityService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.activity) {
                this.queries.act_id = parseInt(params.activity, 10);
            }
            if (params.time) {
                this.queries.time_id = parseInt(params.time, 10);
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
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
        this.service.goodsList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        if (!confirm('确定删除“' + item.name + '”商品？')) {
            return;
        }
        this.service.goodsRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    open(modal: DialogBoxComponent, item?: ISeckillGoods) {
        this.editData = item ? Object.assign({}, item) : {
            id: undefined,
            act_id: this.queries.act_id,
            time_id: this.queries.time_id,
            goods_id: 0,
            amount: 1,
            every_amount: 1,
            price: 1,
        };
        modal.open(() => {
            this.service.goodsSave(this.editData).subscribe(_ => {
                this.toastrService.success('保存成功');
                this.tapRefresh();
            });
        });
    }

}
