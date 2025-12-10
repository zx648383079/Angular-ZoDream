import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { emptyValidate } from '../../../../../theme/validators';
import { ICoupon } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-coupon-picker',
    templateUrl: './coupon-picker.component.html',
    styleUrls: ['./coupon-picker.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CouponPickerComponent),
        multi: true
    }]
})
export class CouponPickerComponent {

    public readonly user = input(0);
    public disabled = false;
    public couponItems: ICoupon[] = [];
    private couponLoaded = false;
    public couponIndex = 0;
    public value: ICoupon;
    public couponCode = '';

    onChange: any = () => {};
    onTouch: any = () => {};

    constructor() { }

    public couponChanged(item: ICoupon) {
        this.value = {...item};
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

    private output(v?: ICoupon) {
        this.value = v;
        this.onChange(this.value);
    }

    writeValue(obj: any): void {
        this.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
