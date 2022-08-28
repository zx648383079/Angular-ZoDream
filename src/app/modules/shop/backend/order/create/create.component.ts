import { Component, OnInit } from '@angular/core';
import { DialogAnimation } from '../../../../../theme/constants';
import { IUser } from '../../../../../theme/models/user';
import { emptyValidate } from '../../../../../theme/validators';
import { IAddress, ICartItem, IGoods } from '../../../model';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    animations: [
        DialogAnimation
    ]
})
export class CreateComponent implements OnInit {

    public dialogOpen = false;
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
        } if (this.stepIndex == 1) {
            return !this.address || emptyValidate(this.address.name) || this.address.region_id < 1;
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

    }

    public tapRemoveGoods(i: number) {

    }

    public onGoodsSelected(items: IGoods|IGoods[]) {
        
    }
}
