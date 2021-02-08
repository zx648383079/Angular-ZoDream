import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from '../../../../theme/models/shop';
import { ShopService } from '../../../shop.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

    public data: IOrder;

    constructor(
        private service: ShopService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.loadOrder(params.id);
        });
    }

    public loadOrder(id: any) {
        this.service.order(id).subscribe(res => {
            this.data = res;
        });
    }

}
