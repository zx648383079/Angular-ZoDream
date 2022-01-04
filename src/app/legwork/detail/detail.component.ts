import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../dialog';
import { LegworkService } from '../legwork.service';
import { IService } from '../model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: IService;
    public amount = 1;
    public remark = [];

    constructor(
        private service: LegworkService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.loadService(params.id);
        });
    }

    get total() {
        if (!this.data) {
            return 0;
        }
        return this.data.price * this.amount;
    }

    public loadService(id: any) {
        this.service.service(id).subscribe(res => {
            this.data = res;
            this.remark = res.form ? res.form : [];
        });
    }

    public onAmountChange() {

    }

    public tapSubmit() {
        if (this.amount < 1) {
            this.toastrService.warning($localize `Incorrect purchase quantity `);
            return;
        }
        const remark: any = {};
        for (const item of this.remark) {
            if (!item.value && item.required) {
                this.toastrService.warning($localize `${item.label} is required`);
                return;
            }
            remark[item.name] = item.value + '';
        }
        this.service.orderCreate({
            service_id: this.data.id,
            amount: this.amount,
            remark
        }).subscribe({
            next: res => {
                this.toastrService.success($localize `The order is successfully placed, waiting for payment `);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

}
