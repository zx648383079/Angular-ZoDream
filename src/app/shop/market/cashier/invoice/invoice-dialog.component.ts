import { Component, Input } from '@angular/core';
import { DialogAnimation } from '../../../../theme/constants';
import { IInvoiceTitle } from '../../../../theme/models/shop';
import { IUser } from '../../../../theme/models/user';

@Component({
    selector: 'app-invoice-dialog',
    templateUrl: './invoice-dialog.component.html',
    styleUrls: ['./invoice-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ]
})
export class InvoiceDialogComponent {

    @Input() public visible = false;
    @Input() public user: IUser;
    public titleTypeItems = ['个人', '企业'];
    public typeItems = ['普通发票', '电子普通发票'];
    public contentItems = ['商品明细', '商品类别'];
    public editData: any = {
        title_type: 0,
        type: 0,
        title: '',
        tax_no: '',
        content: '',
    };
    private confirmFn: (data: IInvoiceTitle) => void;

    constructor() { }

    public open(invoice: IInvoiceTitle, cb: (data: IInvoiceTitle) => void) {
        this.confirmFn = cb;
        if (invoice) {
            this.editData = {...invoice};
        }
        this.visible = true;
    }

    public close(result = false) {
        this.visible = false;
        if (!result) {
            return;
        }
        if (this.confirmFn) {
            this.confirmFn({...this.editData});
        }
    }
}
