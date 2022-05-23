import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IItem } from '../../../../../theme/models/seo';
import { IPayment, IShipping } from '../../../model';
import { PaymentService } from '../../payment.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditPaymentComponent implements OnInit {

    public data: IPayment;

    public items: IItem[] = [];

    public shippingItems: IShipping[] = [];

    public form = this.fb.group({
        name: ['', Validators.required],
        code: ['', Validators.required],
        icon: [''],
        fee: ['0'],
        description: [''],
        shipping: [],
    });

    constructor(
        private service: PaymentService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private toastrService: DialogService,
    ) {
        this.service.paymentPlugin().subscribe(res => {
            this.items = res;
        });
        this.service.shippingAll().subscribe(res => {
            this.shippingItems = res;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.payment(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    code: res.code,
                    icon: res.icon,
                    description: res.description,
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        e?.enter();
        this.service.paymentSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success('保存成功');
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

}
