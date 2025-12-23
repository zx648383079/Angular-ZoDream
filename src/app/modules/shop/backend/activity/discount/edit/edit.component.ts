import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IDiscountConfigure } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { ActivityRuleItems } from '../../model';
import { form, required } from '@angular/forms/signals';
import { parseNumber } from '../../../../../../theme/utils';
import { ButtonEvent } from '../../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-shop-discount-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditDiscountComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        thumb: '',
        description: '',
        scope: [],
        scope_type: '0',
        start_at: '',
        end_at: '',
        configure: {
            type: '0',
            amount: 0,
            check_discount: false,
            check_money: false,
            check_gift: false,
            check_shipping: false,
            discount_value: 0,
            discount_money: 0,
            discount_goods: 0,
        }
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IActivity<IDiscountConfigure>;
    public ruleItems = ActivityRuleItems;

    public readonly scopeType = computed(() => {
        return parseNumber(this.dataForm.scope_type().value());
    });

    public readonly selectUrl = computed(() => {
        switch (this.scopeType()) {
            case 2:
                return 'shop/admin/brand/search';
            case 1:
                return 'shop/admin/category/search';
            case 3:
                return 'shop/admin/goods/search';
            default:
                return null;
        }
    })

    public readonly configureType = computed(() => {
        return parseNumber(this.dataForm.configure.type().value());
    });

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.discount(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope_type: res.scope_type as any,
                    scope: typeof res.scope === 'object' ? res.scope : res.scope.split(',')  as any,
                    start_at: res.start_at as string,
                    end_at: res.end_at as string,
                    configure: {
                        type: res.configure.type as any,
                        amount: res.configure.amount,
                        check_discount: res.configure.check_discount as any,
                        check_money: res.configure.check_money as any,
                        check_gift: res.configure.check_gift as any,
                        check_shipping: res.configure.check_shipping as any,
                        discount_value: res.configure.discount_value,
                        discount_money: res.configure.discount_money,
                        discount_goods: res.configure.discount_goods,
                    }
                });
            });
        });
    }

    public onScopeChange() {
        this.dataForm().value.update(v => {
            v.scope = [];
            return v;
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IActivity<any> = this.dataForm().value() as any;
        if (data.scope_type < 1) {
            data.scope =  '';
        } else if (typeof data.scope === 'object') {
            data.scope = (data.scope as number[]).join(',');
        }
        e?.enter();
        this.service.discountSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

}
