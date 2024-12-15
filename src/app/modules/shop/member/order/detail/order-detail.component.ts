import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IOrder } from '../../../model';
import { ShopService } from '../../../shop.service';

@Component({
    standalone: false,
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

    public data: IOrder;

    constructor(
        private service: ShopService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: DialogService,
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

    public tapRepurchase(item: IOrder) {
        this.service.orderRepurchase(item.id).subscribe({
            next: () => {
                this.toastrService.success('已加入购物车');
                this.router.navigate(['../../../market/cart'], {relativeTo: this.route});
            },
            error: err => {
                this.toastrService.error(err);
            }
        })
    }
}
