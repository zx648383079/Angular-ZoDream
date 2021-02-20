import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrder, IOrderGoods } from '../../../../theme/models/shop';
import { OrderService } from '../order.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: IOrder;

    public items: IOrderGoods[] = [];

    constructor(
        private service: OrderService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.order(params.id).subscribe((res: any) => {
                this.data = res;
                this.items = res.goods || res.goods_list;
            });
        });
    }

    public get timeIndex() {
        if (!this.data || this.data.status < 10 || this.data.status > 80) {
            return 0;
        }
        if (this.data.status === 80) {
            return 5;
        }
        if (this.data.status >= 60) {
            return 4;
        }
        if (this.data.status >= 40) {
            return 3;
        }
        if (this.data.status >= 20) {
            return 2;
        }
        if (this.data.status >= 10) {
            return 1;
        }
        return 0;
    }

    public get timeBarStyle() {
        return {
            width: Math.min(100, this.timeIndex * 25) + '%'
        };
    }

}
