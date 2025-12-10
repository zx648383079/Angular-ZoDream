import { Component, OnInit, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IItem } from '../../../../../theme/models/seo';
import { IPayment, IShipping } from '../../../model';
import { PaymentService } from '../../payment.service';

@Component({
    standalone: false,
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditPaymentComponent implements OnInit {
    private service = inject(PaymentService);
    private route = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    private toastrService = inject(DialogService);


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

    constructor() {
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
            this.toastrService.warning($localize `Incomplete filling of the form`);
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
