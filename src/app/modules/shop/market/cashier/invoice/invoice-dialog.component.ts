import { Component, input, signal } from '@angular/core';
import { IInvoiceTitle } from '../../../model';
import { IUser } from '../../../../../theme/models/user';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-invoice-dialog',
    templateUrl: './invoice-dialog.component.html',
    styleUrls: ['./invoice-dialog.component.scss'],
})
export class InvoiceDialogComponent {

    public visible = false;
    public readonly user = input<IUser>();
    public titleTypeItems = ['个人', '企业'];
    public typeItems = ['普通发票', '电子普通发票'];
    public contentItems = ['商品明细', '商品类别'];
    public readonly editForm = form(signal({
        title_type: 0,
        type: 0,
        title: '',
        tax_no: '',
        content: '',
    }));
    private confirmFn: (data: IInvoiceTitle) => void;

    constructor() { }

    public open(invoice: IInvoiceTitle, cb: (data: IInvoiceTitle) => void) {
        this.confirmFn = cb;
        if (invoice) {
            this.editForm().value.update(v => {
                v.title_type = invoice?.title_type ?? 0;
                v.type = invoice?.type ?? 0;
                v.title = invoice?.title ?? '';
                v.tax_no = invoice?.tax_no ?? '';
                return v;
            });
        }
        this.visible = true;
    }

    public close(result = false) {
        this.visible = false;
        if (!result) {
            return;
        }
        if (this.confirmFn) {
            this.confirmFn({...this.editForm().value() as any});
        }
    }
}
