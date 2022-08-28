import { Component, Input } from '@angular/core';
import { IGoods } from '../../../model';
import { GoodsService } from '../goods.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent {

    @Input() public value: IGoods;
    @Input() public visible = false;
    public amount = 1;
    public stock = 0;
    private confirmFn: (data: IGoods) => void;

    constructor(
        private service: GoodsService,
    ) { }

    public open(data: IGoods);
    public open(data: IGoods, confirm: (data: IGoods) => void);
    public open(data: IGoods, confirm?: (data: IGoods) => void) {
        this.value = data;
        this.visible = true;
        this.confirmFn = confirm;
    }

    public close() {
        this.visible = false;
    }
}
