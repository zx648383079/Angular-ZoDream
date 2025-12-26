import { Component, inject, signal } from '@angular/core';
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
export class PayComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly service = inject(ShopService);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public readonly data = signal<IOrder>(null);
    public readonly paymentItems = signal<IPayment[]>([]);
    public readonly payment = signal<IPayment>(null);

    constructor() {
        this.themeService.titleChanged.next('订单支付');
        this.route.params.subscribe(params => {
            this.loadOrder(params.id);
        });
        this.service.paymentList().subscribe(res => {
            this.paymentItems.set(res.data);
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
                this.data.set(res);
                this.payment.set({
                    code: res.payment_id,
                    name: res.payment_name
                } as any);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public paymentChanged(item: IPayment) {
        this.payment.set(item);
    }

    public onExpired() {
        this.toastrService.warning('您的订单已失效！');
        this.goToOrder(this.data());
    }

    private goToOrder(res: IOrder) {
        this.router.navigate(['/shop/member/order', res.id], {relativeTo: this.route});
    }

}
