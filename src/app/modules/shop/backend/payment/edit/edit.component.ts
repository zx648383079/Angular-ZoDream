import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IItem } from '../../../../../theme/models/seo';
import { IPayment, IShipping } from '../../../model';
import { PaymentService } from '../../payment.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditPaymentComponent implements OnInit {
    private readonly service = inject(PaymentService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public data: IPayment;
    public readonly items = signal<IItem[]>([]);
    public shippingItems: IShipping[] = [];
    public readonly dataModel = signal({
        id: 0,
        name: '',
        code: '',
        icon: '',
        fee: 0,
        description: '',
        shipping: [],
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.code);
    });

    constructor() {
        this.service.paymentPlugin().subscribe(res => {
            this.items.set(res);
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
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    code: res.code,
                    icon: res.icon,
                    description: res.description,
                    fee: 0,
                    shipping: []
                });
            });
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
        const data: any = this.dataForm().value();
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
