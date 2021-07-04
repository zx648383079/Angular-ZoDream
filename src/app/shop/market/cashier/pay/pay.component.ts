import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { IOrder, IPayment } from '../../../../theme/models/shop';
import { ThemeService } from '../../../../theme/services';
import { ShopService } from '../../../shop.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {

    public data: IOrder;
    public paymentItems: IPayment[] = [];
    public payment: IPayment;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: ShopService,
        private toastrService: DialogService,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle('订单支付');
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.loadOrder(params.id);
        });
        this.service.paymentList().subscribe(res => {
            this.paymentItems = res.data;
        });
    }

    public loadOrder(id: any) {
        this.service.order(id).subscribe(res => {
            this.data = res;
        });
    }

    public paymentChanged(item: IPayment) {
        this.payment = item;
    }

}
