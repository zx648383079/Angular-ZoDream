import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogAnimation } from '../../../../../theme/constants';
import { IUser } from '../../../../../theme/models/user';
import { emptyValidate } from '../../../../../theme/validators';
import { IAddress, ICartItem, IGoods, IGoodsResult } from '../../../model';
import { SearchDialogComponent } from '../../goods/search-dialog/search-dialog.component';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {

    @ViewChild(SearchDialogComponent)
    private modal: SearchDialogComponent;
    public stepIndex = 0;
    public user: IUser;
    public address: IAddress;
    public goodsItems: ICartItem[] = [];

    constructor() { }

    ngOnInit() {
    }

    public get invalid(): boolean {
        if (this.stepIndex < 1) {
            return !this.user;
        }
        if (this.stepIndex == 1) {
            return !this.address || emptyValidate(this.address.name) || this.address.region_id < 1;
        }
        if (this.stepIndex == 1) {
            return this.goodsItems.length < 1;
        }
        return false;
    }

    public tapNext() {
        if (this.invalid) {
            return;
        }
        this.stepIndex ++;
    }

    public tapPrevious() {
        if (this.stepIndex > 0) {
            this.stepIndex -- ;
        }
    }

    public tapAddGoods() {
        this.modal.open(items => {
            for (const item of items as IGoodsResult[]) {
                if (this.indexOfGoods(item.id, item.product_id) >= 0) {
                    continue;
                }
                this.goodsItems.push({
                    amount: 1,
                    price: item.price,
                    goods_id: item.id,
                    product_id: item.product_id,
                    attribute_id: item.attribute_id,
                    attribute_value: item.attribute_value,
                    goods: item as IGoods,
                });
            }
        });
    }

    public tapRemoveGoods(i: number) {
        this.goodsItems.splice(i, 1);
    }

    public onGoodsSelected(items: IGoods|IGoods[]) {
        
    }

    private indexOfGoods(goods: number, product: number): number {
        for (let i = 0; i < this.goodsItems.length; i++) {
            const element = this.goodsItems[i];
            if (element.goods_id === goods && element.product_id === product) {
                return i;
            }
        }
        return -1;
    }
}
