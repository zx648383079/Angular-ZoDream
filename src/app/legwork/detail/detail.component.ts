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
            this.toastrService.warning('购买数量不对');
            return;
        }
        const remark: any = {};
        for (const item of this.remark) {
            if (!item.value && item.required) {
                this.toastrService.warning(item.label + '必填');
                return;
            }
            remark[item.name] = item.value + '';
        }
        this.service.orderCreate({
            service_id: this.data.id,
            amount: this.amount,
            remark
        }).subscribe(res => {
            this.toastrService.success('下单成功，等待支付');
        });
    }

}
