import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IErrorResponse } from '../../../theme/models/page';
import { IOrder, IOrderCount, ORDER_STATUS } from '../../../theme/models/shop';
import { IUser } from '../../../theme/models/user';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public user: IUser;
    public orderItems: IOrder[] = [];
    public orderSutotal: IOrderCount = {};

    constructor(
        private service: ShopService,
        private toastrService: ToastrService,
        public route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.service.profile().subscribe(res => {
            this.user = res;
        }, err => {
            const res = err.error as IErrorResponse;
            this.toastrService.warning(res.message || '登录令牌失效，请重新登录');
        });
        this.service.orderSubtotal().subscribe(res => {
            this.orderSutotal = res;
        });
        this.service.orderList({
            status: [ORDER_STATUS.UN_PAY, ORDER_STATUS.PAID_UN_SHIP, ORDER_STATUS.SHIPPED],
            per_page: 10,
        }).subscribe(res => {
            this.orderItems = res.data;
        });
    }

}
