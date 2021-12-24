import { Component, Input } from '@angular/core';
import { DialogAnimation } from '../../../../theme/constants';

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

    constructor() { }

    public open() {
        this.visible = true;
    }

    public close() {
        this.visible = false;
    }
}
