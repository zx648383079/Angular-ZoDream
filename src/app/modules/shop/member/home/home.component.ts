import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IErrorResponse } from '../../../../theme/models/page';
import { IAccountSubtotal, IOrder, IOrderCount, ORDER_STATUS } from '../../model';
import { IUser } from '../../../../theme/models/user';
import { ShopService } from '../../shop.service';

@Component({
    standalone: false,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    private readonly service = inject(ShopService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);


    public user: IUser;
    public orderItems: IOrder[] = [];
    public orderSutotal: IOrderCount = {};
    public accountSubtotal: IAccountSubtotal = {} as any;

    constructor() {
        this.service.profile().subscribe({
            next: res => {
                this.user = res;
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message || '登录令牌失效，请重新登录');
            }
        });
        this.service.batch({
            order_subtotal: {},
            account_subtotal: {}
        }).subscribe(res => {
            this.orderSutotal = res.order_subtotal;
            this.accountSubtotal = res.account_subtotal;
        });
        this.service.orderList({
            status: [ORDER_STATUS.UN_PAY, ORDER_STATUS.PAID_UN_SHIP, ORDER_STATUS.SHIPPED],
            per_page: 10,
        }).subscribe(res => {
            this.orderItems = res.data;
        });
    }

}
