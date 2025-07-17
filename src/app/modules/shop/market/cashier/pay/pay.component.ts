import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IOrder, IPayment, ORDER_STATUS } from '../../../model';
import { ThemeService } from '../../../../../theme/services';
import { ShopService } from '../../../shop.service';

@Component({
    standalone: false,
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
        this.themeService.titleChanged.next('订单支付');
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
        this.service.order(id).subscribe({
            next: res => {
                if (res.status !== ORDER_STATUS.UN_PAY) {
                    this.toastrService.warning('您的订单状态：' + res.status_label);
                    this.goToOrder(res);
                    return;
                }
                this.data = res;
                this.payment = {
                    code: res.payment_id,
                    name: res.payment_name
                } as any;
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public paymentChanged(item: IPayment) {
        this.payment = item;
    }

    public onExpired() {
        this.toastrService.warning('您的订单已失效！');
        this.goToOrder(this.data);
    }

    private goToOrder(res: IOrder) {
        this.router.navigate(['/shop/member/order', res.id], {relativeTo: this.route});
    }

}
