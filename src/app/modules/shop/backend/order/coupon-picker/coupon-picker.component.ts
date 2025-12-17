import { Component, input, model } from '@angular/core';
import { emptyValidate } from '../../../../../theme/validators';
import { ICoupon } from '../../../model';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-coupon-picker',
    templateUrl: './coupon-picker.component.html',
    styleUrls: ['./coupon-picker.component.scss'],
})
export class CouponPickerComponent implements FormValueControl<ICoupon> {

    public readonly user = input(0);
    public readonly disabled = input(false);
    public couponItems: ICoupon[] = [];
    private couponLoaded = false;
    public couponIndex = 0;
    public readonly value = model<ICoupon>();
    public couponCode = '';

    public couponChanged(item: ICoupon) {
        this.value.set({...item});
    }

    public tapExchange() {
        if (emptyValidate(this.couponCode)) {
            // this.toastrService.warning('请输入优惠码');
            return;
        }
        // this.service.couponExchange(this.couponCode).subscribe({
        //     next: _ => {
        //         this.toastrService.success('兑换成功');
        //         this.loadCoupon();
        //         this.couponCode = '';
        //         this.couponIndex = 0;
        //     },
        //     error: err => {
        //         this.toastrService.error(err);
        //     }
        // });
    }
}
