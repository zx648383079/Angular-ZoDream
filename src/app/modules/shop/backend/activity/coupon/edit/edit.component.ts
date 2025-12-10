import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IItem } from '../../../../../../theme/models/seo';
import { parseNumber } from '../../../../../../theme/utils';
import { ICoupon } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { ActivityRuleItems } from '../../model';

@Component({
    standalone: false,
  selector: 'app-shop-coupon-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditCouponComponent implements OnInit {
    private service = inject(ActivityService);
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public form = this.fb.group({
        name: ['', Validators.required],
        thumb: [''],
        type: [0],
        rule: [0],
        rule_value: [0],
        min_money: [0],
        money: [0],
        send_type: [0],
        send_value: [0],
        every_amount: [0],
        start_at: [''],
        end_at: ['']
    });

    public data: ICoupon;
    public typeItems: IItem[] = [
        {name: '优惠', value: 0},
        {name: '折扣', value: 1},
    ];
    public ruleItems: IItem[] = ActivityRuleItems;

    get typeValue() {
        return this.form.get('type').value;
    }

    get ruleType() {
        return this.form.get('rule').value;
    }

    get sendType() {
        return this.form.get('send_type').value;
    }

    get selectUrl() {
        switch (parseNumber(this.ruleType)) {
            case 2:
                return 'shop/admin/brand/search';
            case 1:
                return 'shop/admin/category/search';
            case 3:
                return 'shop/admin/goods/search';
            default:
                return null;
        }
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.coupon(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    thumb: res.thumb,
                    type: res.type,
                    rule: res.rule,
                    rule_value: typeof res.rule_value === 'object' ? res.rule_value as any : res.rule_value.split(','),
                    min_money: res.min_money,
                    money: res.money,
                    send_type: res.send_type,
                    send_value: res.send_value,
                    every_amount: res.every_amount,
                    start_at: res.start_at as any,
                    end_at: res.end_at as any,
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: ICoupon = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        if (data.rule < 1) {
            data.rule_value =  '';
        } else if (typeof data.rule_value === 'object') {
            data.rule_value = (data.rule_value as number[]).join(',');
        }
        this.service.couponSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

}
