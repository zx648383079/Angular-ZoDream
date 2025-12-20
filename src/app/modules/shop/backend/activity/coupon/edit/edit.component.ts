import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IItem } from '../../../../../../theme/models/seo';
import { parseNumber } from '../../../../../../theme/utils';
import { ICoupon } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { ActivityRuleItems } from '../../model';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-shop-coupon-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditCouponComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        thumb: '',
        type: '0',
        rule: '0',
        rule_value: 0,
        min_money: 0,
        money: 0,
        send_type: '0',
        send_value: 0,
        every_amount: 0,
        start_at: '',
        end_at: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: ICoupon;
    public typeItems: IItem[] = [
        {name: '优惠', value: 0},
        {name: '折扣', value: 1},
    ];
    public ruleItems: IItem[] = ActivityRuleItems;

    public readonly typeValue = computed(() => {
        return parseNumber(this.dataForm.type().value());
    });

    public readonly ruleType = computed(() => {
        return parseNumber(this.dataForm.rule().value());
    });

    public readonly sendType = computed(() => {
        return parseNumber(this.dataForm.send_type().value());
    });

    public readonly selectUrl = computed(() => {
        switch (this.ruleType()) {
            case 2:
                return 'shop/admin/brand/search';
            case 1:
                return 'shop/admin/category/search';
            case 3:
                return 'shop/admin/goods/search';
            default:
                return null;
        }
    });

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.coupon(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    thumb: res.thumb,
                    type: res.type as any,
                    rule: res.rule as any,
                    rule_value: typeof res.rule_value === 'object' ? res.rule_value as any : res.rule_value.split(','),
                    min_money: res.min_money,
                    money: res.money,
                    send_type: res.send_type as any,
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
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: ICoupon = this.dataForm().value() as any;
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
