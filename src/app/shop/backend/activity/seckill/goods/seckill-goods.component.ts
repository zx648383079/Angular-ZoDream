import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../../../dialog';
import { ISeckillGoods } from '../../../../../theme/models/shop';
import { ActivityService } from '../../activity.service';

@Component({
  selector: 'app-seckill-goods',
  templateUrl: './seckill-goods.component.html',
  styleUrls: ['./seckill-goods.component.scss']
})
export class SeckillGoodsComponent implements OnInit {

    public items: ISeckillGoods[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public editData: ISeckillGoods = {} as any;
    private activity = 0;
    private time = 0;

    constructor(
        private service: ActivityService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.activity) {
                this.activity = parseInt(params.activity, 10);
            }
            if (params.time) {
                this.activity = parseInt(params.time, 10);
            }
            this.tapRefresh();
        });
    }


    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.goodsList({
            keywords: this.keywords,
            act_id: this.activity,
            time_id: this.time,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
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
            act_id: this.activity,
            time_id: this.time,
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
