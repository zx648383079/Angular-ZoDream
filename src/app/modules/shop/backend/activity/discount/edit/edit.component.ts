import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IDiscountConfigure } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { ActivityRuleItems } from '../../model';
import { form, required } from '@angular/forms/signals';

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
        scope_type: 0,
        start_at: '',
        end_at: '',
        configure: {
            type: 0,
            amount: 0,
            check_discount: 0,
            check_money: 0,
            check_gift: 0,
            check_shipping: 0,
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

    get scopeType() {
        const val = this.dataForm.scope_type.value;
        return typeof val === 'number' ? val : parseInt(val, 10);
    }

    get selectUrl() {
        switch (this.scopeType) {
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

    get configureType() {
        return this.dataForm.configure.get('type').value;
    }

    get configureDiscountType() {
        return this.dataForm.configure.get('discount_type').value;
    }

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
                    scope_type: res.scope_type,
                    scope: typeof res.scope === 'object' ? res.scope : res.scope.split(',')  as any,
                    start_at: res.start_at as string,
                    end_at: res.end_at as string,
                });
                this.dataForm.configure.patchValue(res.configure);
            });
        });
    }

    public onScopeChange() {
        this.dataModel.set({
                        id: res.id,
            scope: [] as any,
        });
    }

    public hasType(index = 1) {
        return this.configureDiscountType >> index % 2 === 1;
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
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
        this.service.discountSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

}
