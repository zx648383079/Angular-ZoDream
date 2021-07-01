import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../dialog';
import { IActivity, IDiscountConfigure } from '../../../../../theme/models/shop';
import { ActivityService } from '../../activity.service';
import { ActivityRuleItems } from '../../model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditDiscountComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        thumb: [''],
        description: [''],
        scope: [[], Validators.required],
        scope_type: [0],
        start_at: [''],
        end_at: [''],
        configure: this.fb.group({
            type: 0,
            amount: 0,
            check_discount: 0,
            check_money: 0,
            check_gift: 0,
            check_shipping: 0,
            discount_value: 0,
            discount_money: 0,
            discount_goods: 0,
        }),
    });

    public data: IActivity<IDiscountConfigure>;
    public ruleItems = ActivityRuleItems;

    constructor(
        private service: ActivityService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    get scopeType() {
        const val = this.form.get('scope_type').value;
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
        return this.form.get('configure').get('type').value;
    }

    get configureDiscountType() {
        return this.form.get('configure').get('discount_type').value;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.discount(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope_type: res.scope_type,
                    scope: typeof res.scope === 'object' ? res.scope : res.scope.split(','),
                    start_at: res.start_at,
                    end_at: res.end_at,
                });
                this.form.get('configure').patchValue(res.configure);
            });
        });
    }

    public onScopeChange() {
        this.form.patchValue({
            scope: [],
        });
    }

    public hasType(index = 1) {
        return this.configureDiscountType >> index % 2 === 1;
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IActivity<any> = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        if (data.scope_type < 1) {
            data.scope =  '';
        } else if (typeof data.scope === 'object') {
            data.scope = (data.scope as number[]).join(',');
        }
        this.service.discountSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

}
